import type { NextRequest } from "next/server"
import { Payment } from "mercadopago"
import { z } from "zod"
import { MercadoPagoConfig } from "mercadopago"
import { buy } from "@/_actions/actions"
import { reduceStock } from "@/_actions/stock-actions"

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// Esquema para notificaciones de payment (formato 1 - completo)
const paymentNotificationSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string().optional(),
  action: z.string().optional(),
})

// Esquema para notificaciones de payment (formato 2 - simple)
const paymentResourceNotificationSchema = z.object({
  resource: z.string(), // El ID del pago viene aquí
  topic: z.literal("payment"),
})

// Esquema para notificaciones de merchant_order
const merchantOrderNotificationSchema = z.object({
  resource: z.string(),
  topic: z.literal("merchant_order"),
})

// Esquema unificado que maneja todos los tipos
const webhookNotificationSchema = z.union([
  paymentNotificationSchema,
  paymentResourceNotificationSchema,
  merchantOrderNotificationSchema,
])

// Esquema para validar los items de Mercado Pago (con coerción de tipos)
const mpItemSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(), // Convierte string a number
  title: z.string(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  unit_price: z.coerce.number(), // Convierte string a number
  variant_id: z.coerce.number().optional(),
})

// Esquema para validar los metadatos (ajustado al formato real de MP)
const metadataSchema = z.object({
  email: z.string(),
  delivery: z.coerce.boolean().default(false),
  variants: z
    .array(
      z.object({
        product_id: z.coerce.number(), // MP usa product_id, no productId
        variant_id: z.coerce.number(), // MP usa variant_id, no variantId
        quantity: z.coerce.number(),   // Convertir string a number
      }),
    )
    .optional()
    .default([]),
})

export async function POST(request: NextRequest) {
  console.log("=== WEBHOOK MERCADO PAGO INICIADO ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("URL:", request.url)
  console.log("Method:", request.method)

  try {
    // Obtener headers para debugging
    const headers = Object.fromEntries(request.headers.entries())
    console.log("Headers recibidos:", JSON.stringify(headers, null, 2))

    // Validar la notificación entrante
    const body = await request.json()

    console.log("=== BODY COMPLETO DEL WEBHOOK ===")
    console.log(JSON.stringify(body, null, 2))

    // Validar el tipo de notificación
    const notification = webhookNotificationSchema.parse(body)

    // Manejar notificaciones de merchant_order
    if ('topic' in notification && notification.topic === 'merchant_order') {
      console.log("📦 Notificación de merchant_order recibida, ignorando...")
      return Response.json({ 
        success: true, 
        message: "Merchant order notification ignored" 
      })
    }

    // Extraer el ID del pago según el formato
    let paymentId: string
    let type = "payment"
    let action: string | undefined

    if ('data' in notification) {
      // Formato 1: { data: { id: "..." }, type: "payment", action: "..." }
      paymentId = notification.data.id
      type = notification.type || "payment"
      action = notification.action
      console.log(`📨 Notificación formato 1: Type=${type}, Action=${action}, ID=${paymentId}`)
    } else if ('resource' in notification && notification.topic === 'payment') {
      // Formato 2: { resource: "...", topic: "payment" }
      paymentId = notification.resource
      console.log(`📨 Notificación formato 2: Topic=${notification.topic}, ID=${paymentId}`)
    } else {
      console.log("⏭️ Formato de notificación no reconocido")
      return Response.json({ success: true, message: "Unknown notification format" })
    }

    // **MANEJAR IDs DE PRUEBA DE MERCADO PAGO**
    if (paymentId === "1234567" || paymentId === "123456789") {
      console.log("🧪 ID de prueba detectado, simulando respuesta exitosa")
      return Response.json({ 
        success: true, 
        message: "Test webhook processed successfully",
        testMode: true,
        paymentId: paymentId
      })
    }

    console.log("🔍 Obteniendo detalles del pago desde Mercado Pago...")
    
    let payment;
    try {
      // Obtener los detalles del pago desde Mercado Pago
      payment = await new Payment(client).get({ id: paymentId })
    } catch (mpError) {
      console.error("❌ Error obteniendo pago de Mercado Pago:", mpError)
      
      // Si es un error 404, podría ser un ID de prueba no reconocido
      if (mpError && typeof mpError === 'object' && 'status' in mpError && mpError.status === 404) {
        console.log("🧪 Pago no encontrado - posiblemente ID de prueba")
        return Response.json({ 
          success: true, 
          message: "Test payment ID not found - this is expected for webhook testing",
          testMode: true,
          paymentId: paymentId
        })
      }
      
      throw mpError
    }

    console.log("=== DETALLES COMPLETOS DEL PAGO ===")
    console.log("Payment ID:", payment.id)
    console.log("Payment status:", payment.status)
    console.log("Payment status detail:", payment.status_detail)
    console.log("Payment metadata:", JSON.stringify(payment.metadata, null, 2))
    console.log("Payment items:", JSON.stringify(payment.additional_info?.items, null, 2))
    console.log("Payment payer:", JSON.stringify(payment.payer, null, 2))

    // Verificar si el pago está aprobado
    if (payment.status !== "approved") {
      console.log(`❌ Pago ${paymentId} no aprobado. Status: ${payment.status}`)
      return Response.json({ success: true, message: `Payment not approved. Status: ${payment.status}` })
    }

    console.log("✅ Pago aprobado, procesando...")

    // Verificar que tenemos los items y metadata necesarios
    const items = payment.additional_info?.items
    if (!items || items.length === 0) {
      console.error(`❌ Items faltantes en pago ${paymentId}`)
      return Response.json({ success: false, message: "Missing items" }, { status: 400 })
    }

    if (!payment.metadata) {
      console.error(`❌ Metadata faltante en pago ${paymentId}`)
      return Response.json({ success: false, message: "Missing metadata" }, { status: 400 })
    }

    try {
      // Filtrar items que no sean delivery-fee y validarlos
      const productItems = items.filter(item => item.id !== "delivery-fee")
      console.log("📦 Items de productos (sin delivery):", JSON.stringify(productItems, null, 2))
      
      const validatedItems = productItems.map((item) => {
        console.log("🔍 Validando item:", JSON.stringify(item, null, 2))
        return mpItemSchema.parse(item)
      })

      // Validar y extraer los metadatos
      console.log("🔍 Validando metadata:", JSON.stringify(payment.metadata, null, 2))
      const metadata = metadataSchema.parse(payment.metadata)

      console.log("=== DATOS PROCESADOS PARA BUY ===")
      console.log(`📧 Email: ${metadata.email}`)
      console.log(`📦 Items: ${validatedItems.length}`)
      console.log(`🚚 Delivery: ${metadata.delivery}`)
      console.log("📋 Items validados:", JSON.stringify(validatedItems, null, 2))
      console.log("🔧 Metadata variants:", JSON.stringify(metadata.variants, null, 2))

      // Convertir el formato de variants de MP al formato esperado por buy()
      const convertedVariants = metadata.variants.map(variant => ({
        productId: variant.product_id,  // Convertir product_id a productId
        variantId: variant.variant_id,  // Convertir variant_id a variantId
        quantity: variant.quantity,
      }))

      console.log("🔄 Variants convertidas:", JSON.stringify(convertedVariants, null, 2))

      // Llamar a la función buy con los datos validados
      console.log("💾 Llamando a función buy...")
      const insertedOrders = await buy(validatedItems, {
        email: metadata.email,
        delivery: metadata.delivery,
        variants: convertedVariants // Usar las variants convertidas
      })

      console.log("✅ Órdenes insertadas:", insertedOrders?.length || 0)

      // Reducir el stock de las variantes
      if (convertedVariants && convertedVariants.length > 0) {
        console.log("📉 Reduciendo stock de variantes...")
        for (const variant of convertedVariants) {
          if (variant.variantId && variant.variantId > 0) {
            console.log(`📉 Reduciendo stock: variant ${variant.variantId} por ${variant.quantity}`)
            try {
              await reduceStock(variant.variantId, variant.quantity)
              console.log(`✅ Stock reducido para variant ${variant.variantId}`)
            } catch (stockError) {
              console.error(`❌ Error reduciendo stock para variant ${variant.variantId}:`, stockError)
              // No fallar todo el proceso por un error de stock
            }
          }
        }
      }

      console.log(`🎉 Pago ${paymentId} procesado exitosamente`)
      return Response.json({ 
        success: true, 
        message: "Payment processed successfully",
        ordersCreated: insertedOrders?.length || 0,
        paymentId: paymentId
      })
      
    } catch (validationError) {
      console.error(`❌ Error de validación para pago ${paymentId}:`, validationError)
      console.error("Stack trace:", validationError instanceof Error ? validationError.stack : 'No stack trace')
      return Response.json({ 
        success: false, 
        error: "Invalid data format",
        details: validationError instanceof Error ? validationError.message : 'Unknown validation error'
      }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Error crítico procesando webhook:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace')
    return Response.json({ 
      success: false, 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Método GET para testing y verificación
export async function GET(request: NextRequest) {
  console.log("=== WEBHOOK GET REQUEST ===")
  console.log("URL:", request.url)
  console.log("Timestamp:", new Date().toISOString())

  return Response.json({ 
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
    url: request.url,
    methods: ["GET", "POST"],
    status: "active"
  })
}
