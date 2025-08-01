"use server"

import { Preference } from "mercadopago"
import { redirect } from "next/navigation"
import type { CartItem } from "../providers/cart-provider"
import { client } from "@/lib/mercadopago"

export async function createCheckoutSession(
  items: CartItem[],
  email?: string,
  deliveryOption: "delivery" | "pickup" = "pickup",
  deliveryCost = 0,
) {
  let redirectUrl: string | null = null

  try {
    const preference = new Preference(client)

    // Determinar si se aplica el costo de envío
    const isDelivery = deliveryOption === "delivery"

    const lineItems = items.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      quantity: item.quantity,
      unit_price: item.price,
      variant_id: item.variantId,
    }))

    // Si es delivery, agregar un item adicional para el costo de envío
    if (isDelivery && deliveryCost > 0) {
      lineItems.push({
        id: "delivery-fee",
        title: "Costo de envío",
        quantity: 1,
        unit_price: deliveryCost,
        variant_id: undefined,
      })
    }

    console.log("🔧 Creando preferencia de Mercado Pago...")
    console.log("Items formateados para Mercado Pago:", lineItems)
    console.log("Delivery option:", deliveryOption, "Delivery cost:", deliveryCost)

    // Usar NEXTAUTH_URL que ya tienes configurada
    const baseUrl = process.env.NEXTAUTH_URL!

    console.log("🌐 Base URL:", baseUrl)

    const result = await preference.create({
      body: {
        items: lineItems,
        metadata: {
          email: email || "",
          delivery: isDelivery,
          variants: items.map((item) => ({
            productId: item.id, // <-- AÑADIR ESTO
            variantId: item.variantId || 0,
            quantity: item.quantity,
          })),
        },
        // 🔧 CONFIGURAR WEBHOOK usando NEXTAUTH_URL
        notification_url: `${baseUrl}/api/payments/webhook`,

        // 🔧 URLs de retorno OBLIGATORIAS para auto_return
        back_urls: {
          success: `${baseUrl}/?payment=success&status=approved`,
          failure: `${baseUrl}/?payment=failure&status=rejected`,
          pending: `${baseUrl}/?payment=pending&status=pending`,
        },

        // 🔧 IMPORTANTE: auto_return requiere back_urls.success
        auto_return: "approved",

        // Configuraciones adicionales
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 6, // Máximo 6 cuotas
        },

        // Configurar expiración (24 horas)
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),

        // Información adicional
        payer: email
          ? {
              email: email,
            }
          : undefined,

        // Configuración de la experiencia de pago
        statement_descriptor: "KRUZA",
      },
    })

    console.log("✅ Preferencia creada exitosamente")
    console.log("Preference ID:", result.id)
    console.log("Notification URL:", `${baseUrl}/api/payments/webhook`)
    console.log("Back URLs:", {
      success: `${baseUrl}/?payment=success&status=approved`,
      failure: `${baseUrl}/?payment=failure&status=rejected`,
      pending: `${baseUrl}/?payment=pending&status=pending`,
    })

    if (result.init_point) {
      redirectUrl = result.init_point
    } else {
      throw new Error("Failed to create checkout session")
    }
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}
