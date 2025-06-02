import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getProducts } from "@/_actions/actions"
import { getAllProductsStockStatus } from "@/_actions/stock-actions"
import Link from "next/link"
import { ProductCard } from "./product-card"

export const CarrouselProducts = async () => {
  const products = await getProducts()

  // Obtener el estado de stock de todos los productos
  const stockStatus = await getAllProductsStockStatus()

  // Crear un mapa para acceder rápidamente al estado de stock por ID de producto
  const stockMap = new Map()
  stockStatus.forEach((status) => {
    stockMap.set(status.productId, status)
  })

  // Marcar productos como agotados según el stock de variantes
  const productsWithStockInfo = products.map((product) => {
    const stock = stockMap.get(product.id)
    return {
      ...product,
      soldOut: stock ? stock.soldOut : true, // Si no hay información de stock, asumir agotado
      discount: product.discount ?? 0,
    }
  })

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="mb-6 w-full"
    >
      <CarouselContent>
        {productsWithStockInfo.map((product) => (
          <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
            <Link href={`/store/${product.id}`} className="block group">
              <ProductCard products={product} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {productsWithStockInfo.length > 3 && (
        <>
          <CarouselPrevious className="hidden lg:inline-flex" />
          <CarouselNext className="hidden lg:inline-flex" />
        </>
      )}
    </Carousel>
  )
}
