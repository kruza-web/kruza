"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../providers/cart-provider"
import { Minus, Plus } from "lucide-react"
import { currency } from "@/lib/utils"
import { CldImage } from "next-cloudinary"

type Product = {
  id: number;
  title: string;
  description: string | null;
  img: string;
  size: string;
  price: number;
  isRecommended: boolean;
  quantity: number;
}


export function ProductCard({ products }: {products:Product}) {
  const { items, addItem, removeItem } = useCart()
  const {id, title, price, img } = products

  // Find if product is in cart and get quantity
  const cartItem = items.find((item) => item.id === id)
  const quantity = cartItem?.quantity || 0



  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <CldImage src={img || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="font-medium">{currency.format(price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="icon" onClick={() => removeItem(id)}>
              <Minus className="size-4" />
            </Button>
            <span className="font-medium">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => addItem({id, title, price, img })}>
              <Plus className="size-4" />
            </Button>
          </div>
      </CardFooter>
    </Card>
  )
}
