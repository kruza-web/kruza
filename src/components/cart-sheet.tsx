"use client";

import {
  useCart,
  type CartItem as CartItemType,
} from "../providers/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { currency } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { createCheckoutSession } from "@/_actions/mercadopago";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function CartSheet({ open, onOpenChange, email }: CartSheetProps) {
  const { items, removeItem, addItem, updateQuantity, clearCart, totalPrice } =
    useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
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
            <p className="text-muted-foreground text-sm">
              Agrega articulos a tu carrito para verlos aca
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
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
                        size: item.size
                      })
                    }
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(quantity) =>
                      updateQuantity(item.id, quantity)
                    }
                  />
                ))}
              </ul>
            </div>

            <SheetFooter className="flex-col gap-4 sm:gap-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <span>{currency.format(totalPrice)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="size-4" />
                  Vaciar carrito
                </Button>
                <Button onClick={() => createCheckoutSession(items, email)}>
                  Comprar
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItem({
  item,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItemType;
  onAdd: () => void;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <li className="flex gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
        <CldImage
          src={item.img || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {currency.format(item.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onRemove}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-6 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onAdd}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium">
            {currency.format(item.price * item.quantity)}
          </p>
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
  );
}
