import { getProducts } from "@/_actions/actions"
import { getAllProductsStockStatus } from "@/_actions/stock-actions"
import banner1 from "../../../public/banner1.jpeg"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const products = await getProducts()

  // Obtener el estado de stock de todos los productos
  const stockStatus = await getAllProductsStockStatus()

  // Crear un mapa para acceder rápidamente al estado de stock por ID de producto
  const stockMap = new Map()
  stockStatus.forEach((status) => {
    stockMap.set(status.productId, status)
  })

  // Marcar productos como agotados según el stock de variantes y aplicar descuentos
  const productsWithSoldOutFlag = products.map((product) => {
    const stock = stockMap.get(product.id)
    return {
      ...product,
      soldOut: stock ? stock.soldOut : true, // Si no hay información de stock, asumir agotado
      discount: product.discount ?? 0,
    }
  })

  return (
    <>
      {/* BANNER RESPONSIVE */}
      <div className="pt-10 w-full overflow-hidden">
        {/* DESKTOP & TABLET */}
        <div className="hidden sm:block w-full h-[400px] relative lg:h-[1080px]">
          <Image src={banner1 || "/placeholder.svg"} alt="Banner horizontal" fill className="object-fill" priority />
        </div>
        {/* MÓVIL */}
        <div className="block sm:hidden w-screen h-[100vw] relative">
          <Image
            src={banner1 || "/placeholder.svg"}
            alt="Banner vertical"
            fill
            className="object-center rotate-90 origin-center"
            priority
          />
        </div>
      </div>

      <div className="m-12">
        <h1 className="mb-6">NUESTRA ROPITA</h1>
        <div>
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {productsWithSoldOutFlag.map(
              (product) =>
                product.isRecommended && (
                  <li key={product.id}>
                    <Link href={`/store/${product.id}`}>
                      <ProductCard products={product} />
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-center">
        <Link href="/store">
          <Button variant="outline" className="w-full h-full text-lg text-gray-600 rounded-none shadow-none">
            Ver Tienda
          </Button>
        </Link>
      </div>
    </>
  )
}
