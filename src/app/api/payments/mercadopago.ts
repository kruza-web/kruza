import type { NextRequest } from "next/server"
import { Payment } from "mercadopago"
import { z } from "zod"
import { MercadoPagoConfig } from "mercadopago"
import { buy } from "@/_actions/actions"
import { reduceStock } from "@/_actions/stock-actions"

export const client = new MercadoPagoConfig({
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
        variantId: z.number(),
        quantity: z.number(),
      }),
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Validar la notificación entrante
    const body = await request.json()
    const {
      data: { id },
      type = "payment",
    } = paymentSchema.parse(body)

    // Log para depuración
    console.log(`Received webhook notification: Type=${type}, ID=${id}`)

    // Solo procesamos notificaciones de tipo 'payment'
    if (type !== "payment") {
      console.log(`Ignoring non-payment notification: ${type}`)
      return Response.json({ success: true, message: "Not a payment notification" })
    }

    // Obtener los detalles del pago desde Mercado Pago
    const payment = await new Payment(client).get({ id })

    // Log para depuración
    console.log(`Payment status: ${payment.status}`)

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

      console.log(
        `Processing purchase for email: ${metadata.email}, items: ${validatedItems.length}, delivery: ${metadata.delivery}`,
      )

      // Llamar a la función buy con los datos validados y la opción de delivery
      await buy(validatedItems, metadata)

      // Reducir el stock de las variantes
      if (metadata.variants && metadata.variants.length > 0) {
        for (const variant of metadata.variants) {
          await reduceStock(variant.variantId, variant.quantity)
        }
      }

      console.log(`Successfully processed payment ${id}`)
      return Response.json({ success: true })
    } catch (validationError) {
      console.error(`Validation error for payment ${id}:`, validationError)
      return Response.json({ success: false, error: "Invalid data format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
