"use server"

import { Preference } from "mercadopago"
import { redirect } from "next/navigation"
import type { CartItem } from "../providers/cart-provider"
import { client } from "@/app/api/payments/mercadopago"

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
        variant_id: undefined, // Agregar esta línea
      })
    }

    const result = await preference.create({
      body: {
        items: lineItems,
        metadata: {
          email: email,
          delivery: isDelivery,
          variants: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
    })

    console.log("Items formateados para Mercado Pago:", lineItems)
    console.log("Delivery option:", deliveryOption, "Delivery cost:", deliveryCost)

    if (result.init_point) {
      redirectUrl = result.init_point
    } else {
      throw new Error("Failed to create checkout session")
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}
