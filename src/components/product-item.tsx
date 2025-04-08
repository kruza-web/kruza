'use client'
import { CldImage } from "./cld-image"

type Product = {
    id: number,
    title: string,
    price: number,
    img: string,
    size: string,
  }

export default function ProductItem({ product }: {product: Product}) {
  // Función para formatear el precio con separadores de miles
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800  rounded-md cursor-pointer">
      <div className="flex-shrink-0 h-16 w-16 relative">
        <CldImage src={product.img || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{product.title}</h3>
        <p className="text-sm font-semibold ">${formatPrice(product.price)}</p>
        <p className="text-xs ">Tenes estos talles {product.size} disponibles.</p>
      </div>
    </div>
  )
}

