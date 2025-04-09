"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "../providers/cart-provider"
import { CartSheet } from "../components/cart-sheet"

export function Cart({email}: { email?: string }) {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <Button variant="outline" size="icon" className="relative" onClick={() => setOpen(true)}>
        <ShoppingBag className="size-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Button>
      <CartSheet open={open} onOpenChange={setOpen} email={email} />
    </>
  )
}
