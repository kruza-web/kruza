import { getProducts } from "@/_actions/actions"
import { getAllProductsStockStatus } from "@/_actions/stock-actions"
import { ProductCarousel } from "@/components/products-carrousel"
import { PromoBanner } from "@/components/promo-banner"
import { CategoryShowcase } from "@/components/category-showcase"
import { InfoBanner } from "@/components/info-banner"
import Image from "next/image"

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
      <div className="min-h-screen">
        {/* Mobile Layout - Split screen */}
        <div className="w-full flex flex-col">
          {/* LADO IZQUIERDO */}
          <div className="relative w-full h-[90vh] md:hidden overflow-hidden bg-gray-100">
            <img src="/pic1.jpg" alt="Fashion model" className="w-full h-full object-cover" />
          </div>

          {/* LADO DERECHO - 50% */}
          <div className="relative w-full h-[90vh] md:hidden flex items-center justify-center">
            {/* Imagen de fondo */}
            <img
              src="/pic3.jpg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-20"></div>

          </div>
        </div>

        {/* Tablet & Desktop Layout - Full screen banner */}
        <div className="hidden md:block relative w-full h-screen overflow-hidden">
          <Image src="/banner-principal.jpg" alt="Fashion banner" width={3400} height={3400} className="w-full h-full object-cover" />
        </div>

        <ProductCarousel products={productsWithSoldOutFlag} />

        {/* PROMO BANNER */}
        <PromoBanner />

        {/* CATEGORY SHOWCASE */}
        <CategoryShowcase />

        {/* INFO BANNER */}
        <InfoBanner />
      </div>
    </>
  )
}
