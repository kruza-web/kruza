import { getProducts } from "@/_actions/actions"
import { getAllProductsStockStatus } from "@/_actions/stock-actions"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCarousel } from "@/components/products-carrousel"
import { PromoBanner } from "@/components/promo-banner"
import { CategoryShowcase } from "@/components/category-showcase"
import { InfoBanner } from "@/components/info-banner"

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
      {/* HERO SECTION - SPLIT SCREEN */}
      <div className="w-full h-screen flex">
        {/* LADO IZQUIERDO - 50% */}
        <div className="w-1/2 relative overflow-hidden bg-gray-100">
          <img src="/pic1.jpg" alt="Fashion model" className="w-full h-full object-cover" />
          {/* Overlay con texto */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 px-8 py-4 transform -rotate-2">
              <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
                ESTAS LISTO PARA
                <br />
                <span className="text-3xl md:text-5xl">KRUZA?</span>
              </h2>
            </div>
          </div>
        </div>

                {/* LADO DERECHO - 50% */}
        <div className="w-1/2 relative flex items-center justify-center">
          {/* Imagen de fondo */}
          <img
            src="/pic3.jpg" // Cambia la ruta por la imagen que desees
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>

          {/* Contenido */}
          <div className="relative z-10 text-center text-white px-8">
            <p className="text-sm md:text-base font-medium mb-4 tracking-wider">[ NEW ITEMS ON SALE ]</p>
            <h1 className="text-6xl md:text-8xl font-bold mb-2">HASTA</h1>
            <h1 className="text-6xl md:text-8xl font-bold mb-8">50%OFF</h1>
            <Link href="/store">
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg font-medium"
              >
                COMPRAR AHORA
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ProductCarousel products={productsWithSoldOutFlag} />

      {/* PROMO BANNER */}
      <PromoBanner />

      {/* CATEGORY SHOWCASE */}
      <CategoryShowcase />

      {/* INFO BANNER */}
      <InfoBanner />
    </>
  )
}
