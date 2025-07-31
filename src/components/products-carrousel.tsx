"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CldImage } from "next-cloudinary"
import { currency } from "@/lib/utils"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface ProductCarouselProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function ProductCarousel({
  products,
  title = "Colección Invierno",
  subtitle = "Hasta 50% OFF",
}: ProductCarouselProps) {
  // Filtrar solo productos recomendados y con descuento para el carousel
  const featuredProducts = products.filter((product) => product.isRecommended && (product.discount || 0) > 0)

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <div className="w-full py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-18">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-lg text-gray-600 font-medium">{subtitle}</p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product) => {
              const discountedPrice = product.discount
                ? product.price - (product.price * product.discount) / 100
                : product.price

              return (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="group relative overflow-hidden">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Link href={`/store/${product.id}`}>
                        <CldImage
                          src={product.img}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Discount Badge */}
                      {product.discount && product.discount > 0 && (
                        <Badge className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.discount}% OFF
                        </Badge>
                      )}

                      {/* Sold Out Overlay */}
                      {product.soldOut && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">AGOTADO</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 text-center">
                      <Link href={`/store/${product.id}`}>
                        <h3 className="font-medium text-lg text-gray-900 mb-2 hover:text-gray-700 transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-2 mb-3 text-center">
                        {product.discount && product.discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-400 line-through">{currency.format(product.price)}</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {currency.format(discountedPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">{currency.format(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden lg:flex -left-12 bg-white shadow-lg border-0 hover:bg-gray-50" />
          <CarouselNext className="hidden lg:flex -right-12 bg-white shadow-lg border-0 hover:bg-gray-50" />
        </Carousel>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/store">
            <Button variant="outline" className="px-8 py-3  text-lg font-medium bg-transparent">
              Ver Toda la Colección
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
