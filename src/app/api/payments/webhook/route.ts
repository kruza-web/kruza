import type { NextRequest } from "next/server"
import { Payment, MerchantOrder } from "mercadopago"
import { z } from "zod"
import { buy } from "@/_actions/actions"
import { reduceStock } from "@/_actions/stock-actions"
import { client } from "@/lib/mercadopago"

// Esquema para validar los metadatos (debe coincidir con lo que enviamos)
const metadataSchema = z.object({
  email: z.string(),
  delivery: z.union([z.boolean(), z.string()]).transform((val) => (typeof val === "string" ? val === "true" : val)),
  variants: z.array(
    z.object({
      productId: z.coerce.number(),
      variantId: z.coerce.number(),
      quantity: z.coerce.number(),
    }),
  ),
})

// Esquema genérico para el webhook
const webhookSchema = z.object({
  topic: z.string().optional(),
  type: z.string().optional(),
  resource: z.string().optional(),
  data: z
    .object({
      id: z.string(),
    })
    .optional(),
})

async function processMerchantOrder(merchantOrderId: string) {
  console.log(`🔍 Procesando Merchant Order ID: ${merchantOrderId}`)
  const merchantOrderInstance = new MerchantOrder(client)
  const merchantOrder = await merchantOrderInstance.get({ merchantOrderId })

  console.log("📦 Merchant Order Status:", merchantOrder.status)
  console.log("📦 Order Status:", merchantOrder.order_status)

  // Procesamos la orden solo si está pagada
  if (merchantOrder.order_status !== "paid") {
    console.log(`Orden ${merchantOrderId} no está pagada. Estado: ${merchantOrder.order_status}. Ignorando.`)
    return
  }

  const metadata = metadataSchema.parse((merchantOrder as any).metadata)
  console.log("✅ Metadata validada:", metadata)

  // Llamar a la función buy con los datos de la orden
  await buy(metadata)

  // Reducir el stock de las variantes
  if (metadata.variants && metadata.variants.length > 0) {
    console.log("=== REDUCIENDO STOCK ===")
    for (const variant of metadata.variants) {
      console.log(`Reduciendo stock para variante ${variant.variantId} por ${variant.quantity}`)
      await reduceStock(variant.variantId, variant.quantity)
    }
  }
}

async function processPayment(paymentId: string) {
  console.log(`🔍 Procesando Payment ID: ${paymentId}`)
  const payment = await new Payment(client).get({ id: paymentId })

  console.log("💳 Payment Status:", payment.status)

  if (payment.status !== "approved") {
    console.log(`Pago ${paymentId} no aprobado. Estado: ${payment.status}. Ignorando.`)
    return
  }

  if (!payment.metadata) {
    console.warn(`Faltan metadatos en el pago ${paymentId}`)
    return
  }

  const metadata = metadataSchema.parse(payment.metadata)
  console.log("✅ Metadata validada:", metadata)

  await buy(metadata)

  if (metadata.variants && metadata.variants.length > 0) {
    console.log("=== REDUCIENDO STOCK ===")
    for (const variant of metadata.variants) {
      console.log(`Reduciendo stock para variante ${variant.variantId} por ${variant.quantity}`)
      await reduceStock(variant.variantId, variant.quantity)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 WEBHOOK RECIBIDO - INICIANDO PROCESAMIENTO")
    const body = await request.json()
    console.log("Body completo:", JSON.stringify(body, null, 2))

    const parsedBody = webhookSchema.parse(body)

    const topic = parsedBody.topic || parsedBody.type || "unknown"
    console.log(`Identificado Tópico: ${topic}`)

    if (topic.includes("merchant_order")) {
      const merchantOrderId = parsedBody.resource?.split("/").pop() || parsedBody.data?.id
      if (merchantOrderId) {
        await processMerchantOrder(merchantOrderId)
      } else {
        console.error("❌ No se pudo extraer el ID de la Merchant Order")
      }
    } else if (topic.includes("payment")) {
      const paymentId = parsedBody.data?.id
      if (paymentId) {
        await processPayment(paymentId)
      } else {
        console.error("❌ No se pudo extraer el ID del Pago")
      }
    } else {
      console.log(`Ignorando tópico no reconocido: ${topic}`)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("❌ Error procesando webhook:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return Response.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function GET() {
  console.log("🔍 Webhook endpoint verificado - GET request recibido")
  return Response.json({
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
