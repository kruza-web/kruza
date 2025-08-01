import type { NextRequest } from "next/server"
import { Payment } from "mercadopago"
import { z } from "zod"
import { buy } from "@/_actions/actions"
import { reduceStock } from "@/_actions/stock-actions"
import { client } from "@/lib/mercadopago"

// Esquema más flexible para manejar diferentes formatos de webhook
const paymentSchema = z.union([
  // Formato estándar
  z.object({
    data: z.object({
      id: z.string(),
    }),
    type: z.string().optional(),
  }),
  // Formato alternativo donde el ID puede venir directamente
  z.object({
    id: z.string(),
    type: z.string().optional(),
  }),
  // Formato con action
  z.object({
    action: z.string(),
    data: z.object({
      id: z.string(),
    }),
    type: z.string().optional(),
  }),
])

// Esquema para validar los items de Mercado Pago con coerción de tipos
const mpItemSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(), // Convierte string a number
  title: z.string(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  unit_price: z.coerce.number(), // Convierte string a number
  variant_id: z.coerce.number().optional(), // Convierte string a number
})

// Esquema para validar los metadatos
const metadataSchema = z.object({
  email: z.string(),
  delivery: z.union([z.boolean(), z.string()]).transform((val) => (typeof val === "string" ? val === "true" : val)),
  variants: z
    .array(
      z.object({
        variantId: z.coerce.number(),
        quantity: z.coerce.number(),
      }),
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 WEBHOOK RECIBIDO - INICIANDO PROCESAMIENTO")
    console.log("🌐 URL:", request.url)
    console.log("🕐 Timestamp:", new Date().toISOString())

    // Validar la notificación entrante
    const body = await request.json()

    // 🔍 LOG DETALLADO PARA DEBUGGING
    console.log("=== WEBHOOK MERCADO PAGO ===")
    console.log("Body completo:", JSON.stringify(body, null, 2))
    console.log("Headers:", Object.fromEntries(request.headers.entries()))

    let paymentId: string
    let notificationType = "payment"

    try {
      const parsedBody = paymentSchema.parse(body)

      // Extraer ID y tipo según el formato
      if ("data" in parsedBody && parsedBody.data) {
        paymentId = parsedBody.data.id
        // Manejar el tipo de forma segura
        if ("type" in parsedBody) {
          notificationType = parsedBody.type || "payment"
        } else if ("action" in parsedBody) {
          notificationType = "payment" // Default para formato con action
        }
      } else if ("id" in parsedBody) {
        paymentId = parsedBody.id
        notificationType = parsedBody.type || "payment"
      } else {
        throw new Error("No se pudo extraer el ID del pago")
      }
    } catch (parseError) {
      console.error("❌ Error parsing webhook body:", parseError)
      console.log("Raw body:", JSON.stringify(body, null, 2))
      return Response.json({ success: false, error: "Invalid webhook format" }, { status: 400 })
    }

    console.log(`Received webhook notification: Type=${notificationType}, ID=${paymentId}`)

    // Solo procesamos notificaciones de tipo 'payment'
    if (notificationType !== "payment") {
      console.log(`Ignoring non-payment notification: ${notificationType}`)
      return Response.json({ success: true, message: "Not a payment notification" })
    }

    // Obtener los detalles del pago desde Mercado Pago
    console.log("🔍 Obteniendo detalles del pago desde Mercado Pago...")
    const payment = await new Payment(client).get({ id: paymentId })

    // 🔍 LOG DEL PAGO COMPLETO
    console.log("=== DETALLES DEL PAGO ===")
    console.log("Payment status:", payment.status)
    console.log("Payment metadata:", JSON.stringify(payment.metadata, null, 2))
    console.log("Payment items:", JSON.stringify(payment.additional_info?.items, null, 2))

    // Verificar si el pago está aprobado
    if (payment.status !== "approved") {
      console.log(`Payment ${paymentId} not approved. Status: ${payment.status}`)
      return Response.json({ success: true, message: "Payment not approved" })
    }

    // Verificar que tenemos los items y metadata necesarios
    const items = payment.additional_info?.items
    if (!items || items.length === 0) {
      console.warn(`Missing items in payment ${paymentId}`)
      return Response.json({ success: false, message: "Missing items" }, { status: 400 })
    }

    if (!payment.metadata) {
      console.warn(`Missing metadata in payment ${paymentId}`)
      return Response.json({ success: false, message: "Missing metadata" }, { status: 400 })
    }

    try {
      // Validar y transformar los items
      console.log("🔍 Validando items...")
      const validatedItems = items.map((item, index) => {
        console.log(`Item ${index}:`, JSON.stringify(item, null, 2))
        try {
          return mpItemSchema.parse(item)
        } catch (itemError) {
          console.error(`Error validating item ${index}:`, itemError)
          throw itemError
        }
      })

      // Validar y extraer los metadatos
      console.log("🔍 Validando metadata...")
      const metadata = metadataSchema.parse(payment.metadata)

      console.log("=== DATOS PROCESADOS ===")
      console.log(`Processing purchase for email: ${metadata.email}`)
      console.log(`Items: ${validatedItems.length}`)
      console.log(`Delivery: ${metadata.delivery}`)
      console.log("Validated items:", JSON.stringify(validatedItems, null, 2))
      console.log("Metadata:", JSON.stringify(metadata, null, 2))

      // Llamar a la función buy con los datos validados y la opción de delivery
      console.log("🛒 Llamando a función buy...")
      await buy(validatedItems, metadata)

      // Reducir el stock de las variantes
      if (metadata.variants && metadata.variants.length > 0) {
        console.log("=== REDUCIENDO STOCK ===")
        for (const variant of metadata.variants) {
          console.log(`Reducing stock for variant ${variant.variantId} by ${variant.quantity}`)
          await reduceStock(variant.variantId, variant.quantity)
        }
      }

      console.log(`✅ Successfully processed payment ${paymentId}`)
      return Response.json({ success: true })
    } catch (validationError) {
      console.error(`❌ Validation error for payment ${paymentId}:`, validationError)
      return Response.json({ success: false, error: "Invalid data format" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// También manejar GET para verificar que el endpoint funciona
export async function GET() {
  console.log("🔍 Webhook endpoint verificado - GET request recibido")
  return Response.json({
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
