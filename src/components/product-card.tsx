"use client"
import { currency } from "@/lib/utils"
import { CldImage } from "next-cloudinary"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: number
  title: string
  description: string | null
  img: string
  img2: string
  size: string
  price: number
  discount?: number
  isRecommended: boolean
  category: string
  quantity?: number
  soldOut?: boolean
}

export function ProductCard({ products }: { products: Product }) {
  const [hovered, setHovered] = useState(false)
  const { title, price, discount = 0, img, img2, soldOut } = products

  // Calcular el precio con descuento
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price

  return (
    <div className="flex flex-col items-center w-full p-2">
      <div
        className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {discount > 0 && !soldOut && <Badge className="absolute top-2 right-2 z-10 ">{discount}% OFF</Badge>}

        <CldImage
          src={hovered && img2 ? img2 : img}
          alt={title}
          width={500}
          height={750}
          className="object-cover w-full h-full transition-transform duration-1200 group-hover:scale-105"
        />

        {soldOut && (
          <div className="absolute bottom-0 right-0 left-0 bg-black bg-opacity-60 py-2 text-center z-10">
            <span className="text-white font-semibold">AGOTADO</span>
          </div>
        )}
      </div>
      <h2 className="pt-4 px-2 text-md text-gray-500 text-center w-full">{title}</h2>
      <div className="pt-2 px-2 text-center w-full">
        {discount > 0 && !soldOut ? (
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-gray-400 line-through">{currency.format(price)}</p>
            <p className="text-sm text-black font-semibold">{currency.format(discountedPrice)}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">{currency.format(price)}</p>
        )}
      </div>
    </div>
  )
}
