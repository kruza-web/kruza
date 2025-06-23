"use client"

import { useCart, type CartItem as CartItemType } from "../providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { ShoppingBag, Trash2 } from "lucide-react"
import { currency } from "@/lib/utils"
import { CldImage } from "next-cloudinary"
import { createCheckoutSession } from "@/_actions/mercadopago"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { DeliveryForm } from "@/components/delivery-form"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string
}

export function CartSheet({ open, onOpenChange, email }: CartSheetProps) {
  const {
    items,
    removeItem,
    addItem,
    updateQuantity,
    clearCart,
    totalPrice,
    deliveryOption,
    setDeliveryOption,
    deliveryCost,
    finalTotal,
  } = useCart()

  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  const handleDeliveryOptionChange = (value: "delivery" | "pickup") => {
    setDeliveryOption(value)
    setShowDeliveryForm(value === "delivery")
  }

  const handleCheckout = () => {
    if (deliveryOption === "delivery" && showDeliveryForm) {
      // Si es delivery y necesita mostrar el formulario, no proceder con el checkout
      return
    }
    createCheckoutSession(items, email, deliveryOption, deliveryCost)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-4">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <ShoppingBag className="size-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">Tu carrito esta vacio</p>
            <p className="text-muted-foreground text-sm">Agrega articulos a tu carrito para verlos aca</p>
          </div>
        ) : (
          <>
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
              {/* Lista de productos */}
              <div className="py-6">
                <ul className="space-y-5">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onAdd={() =>
                        addItem({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          img: item.img,
                          size: item.size,
                        })
                      }
                      onRemove={() => removeItem(item.id)}
                      onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                    />
                  ))}
                </ul>
              </div>

              {/* Opciones de entrega - Movidas aquí */}
              <div className="border-t pt-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Opciones de entrega</h3>
                  <RadioGroup
                    value={deliveryOption}
                    onValueChange={(value) => handleDeliveryOptionChange(value as "delivery" | "pickup")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Retiro en depósito (Gratis)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Delivery (${currency.format(10000).replace("$", "")})</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Formulario de delivery */}
                {showDeliveryForm && <DeliveryForm email={email} onComplete={() => setShowDeliveryForm(false)} />}
              </div>
            </div>

            {/* Footer fijo */}
            <SheetFooter className="flex-col gap-4 sm:gap-4 border-t pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{currency.format(totalPrice)}</span>
                </div>
                {deliveryOption === "delivery" && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Costo de envío</span>
                    <span>{currency.format(deliveryCost)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>{currency.format(finalTotal)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={clearCart} className="flex items-center gap-2">
                  <Trash2 className="size-4" />
                  Vaciar carrito
                </Button>
                <Button onClick={handleCheckout} disabled={deliveryOption === "delivery" && showDeliveryForm}>
                  Comprar
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartItem({
  item,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItemType
  onAdd: () => void
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}) {
  return (
    <li className="flex gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
        <CldImage src={item.img || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {currency.format(item.price)} x {item.quantity} unidades
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium">{currency.format(item.price * item.quantity)}</p>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => onUpdateQuantity(0)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  )
}
