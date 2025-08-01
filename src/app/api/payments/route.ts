import type { NextRequest } from "next/server"
import { Payment } from "mercadopago"
import { z } from "zod"
import { MercadoPagoConfig } from "mercadopago"
import { buy } from "@/_actions/actions"
import { reduceStock } from "@/_actions/stock-actions"

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// Esquema mejorado para validar la notificación de pago
const paymentSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string().optional(),
})

// Esquema para validar los items de Mercado Pago
const mpItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  title: z.string(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  unit_price: z.number(),
  variant_id: z.number().optional(),
})

// Actualizar el esquema para validar los metadatos
const metadataSchema = z.object({
  email: z.string(),
  delivery: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        productId: z.coerce.number(),
        variantId: z.coerce.number(),
        quantity: z.coerce.number(),
      }),
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Validar la notificación entrante
    const body = await request.json()

    // 🔍 LOG DETALLADO PARA DEBUGGING
    console.log("=== WEBHOOK MERCADO PAGO ===")
    console.log("Body completo:", JSON.stringify(body, null, 2))

    const {
      data: { id },
      type = "payment",
    } = paymentSchema.parse(body)

    console.log(`Received webhook notification: Type=${type}, ID=${id}`)

    // Solo procesamos notificaciones de tipo 'payment'
    if (type !== "payment") {
      console.log(`Ignoring non-payment notification: ${type}`)
      return Response.json({ success: true, message: "Not a payment notification" })
    }

    // Obtener los detalles del pago desde Mercado Pago
    const payment = await new Payment(client).get({ id })

    // 🔍 LOG DEL PAGO COMPLETO
    console.log("=== DETALLES DEL PAGO ===")
    console.log("Payment status:", payment.status)
    console.log("Payment metadata:", JSON.stringify(payment.metadata, null, 2))
    console.log("Payment items:", JSON.stringify(payment.additional_info?.items, null, 2))

    // Verificar si el pago está aprobado
    if (payment.status !== "approved") {
      console.log(`Payment ${id} not approved. Status: ${payment.status}`)
      return Response.json({ success: true, message: "Payment not approved" })
    }

    // Verificar que tenemos los items y metadata necesarios
    const items = payment.additional_info?.items
    if (!items) {
      console.warn(`Missing items in payment ${id}`)
      return Response.json({ success: false, message: "Missing items" }, { status: 400 })
    }

    if (!payment.metadata) {
      console.warn(`Missing metadata in payment ${id}`)
      return Response.json({ success: false, message: "Missing metadata" }, { status: 400 })
    }

    try {
      // Validar y transformar los items
      const validatedItems = items.map((item) => mpItemSchema.parse(item))

      // Validar y extraer los metadatos
      const metadata = metadataSchema.parse(payment.metadata)

      console.log("=== DATOS PROCESADOS ===")
      console.log(`Processing purchase for email: ${metadata.email}`)
      console.log(`Items: ${validatedItems.length}`)
      console.log(`Delivery: ${metadata.delivery}`)
      console.log("Validated items:", JSON.stringify(validatedItems, null, 2))
      console.log("Metadata:", JSON.stringify(metadata, null, 2))

      // Llamar a la función buy con los datos validados y la opción de delivery
      await buy(items, payment.metadata)

      // Reducir el stock de las variantes
      if (metadata.variants && metadata.variants.length > 0) {
        console.log("=== REDUCIENDO STOCK ===")
        for (const variant of metadata.variants) {
          console.log(`Reducing stock for variant ${variant.variantId} by ${variant.quantity}`)
          await reduceStock(variant.variantId, variant.quantity)
        }
      }

      console.log(`✅ Successfully processed payment ${id}`)
      return Response.json({ success: true })
    } catch (validationError) {
      console.error(`❌ Validation error for payment ${id}:`, validationError)
      return Response.json({ success: false, error: "Invalid data format" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
