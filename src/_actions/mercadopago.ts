"use server"

import {  Preference } from "mercadopago"
import { redirect } from "next/navigation"
import type { CartItem } from "../providers/cart-provider"
import { client } from "@/app/api/payments/mercadopago"

export async function createCheckoutSession(items: CartItem[], userId?: string) {
  let redirectUrl: string | null = null;
  
  try {
    const preference = new Preference(client)

    const lineItems = items.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      quantity: item.quantity,
      unit_price: item.price,
    }))

    const result = await preference.create({
      body: {
        items: lineItems,
        metadata: {
          userId: userId,
        },
      },
    })

    console.log("Items formateados para Mercado Pago:", lineItems);

    if (result.init_point) {
      redirectUrl = result.init_point;
    } else {
      throw new Error("Failed to create checkout session")
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}