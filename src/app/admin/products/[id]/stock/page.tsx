import { getProductById, getProductVariants, getColors } from "@/_actions/stock-actions"
import { StockForm } from "./stock-form"
import { StockTable } from "./stock-table"
import { redirect } from "next/navigation"
import { Suspense } from "react"

type StockPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function StockPage({ params }: StockPageProps) {
  const resolvedParams = await params;
  const productId = Number.parseInt(resolvedParams.id ?? "");

  if (isNaN(productId)) {
    redirect("/admin/products")
  }

  const product = await getProductById(productId.toString())

  if (!product) {
    redirect("/admin/products")
  }

  const colors = await getColors()
  const variants = await getProductVariants(productId)
  const variantsWithColorName = variants.map(variant => ({
  ...variant,
  colorName: colors.find(c => c.id === variant.colorId)?.name ?? "Sin color"
}));

  // Extraer los tamaños disponibles del producto
  const sizes = product.size.split(",").map((size) => size.trim())

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">Gestión de Stock</h1>
        <p className="mt-2 text-lg">{product.title}</p>
        <p className="mt-4 text-md">Administra el stock de las diferentes variantes de este producto.</p>
      </div>

      <StockForm productId={productId} colors={colors} sizes={sizes} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-center">Inventario Actual</h2>
        <Suspense fallback={<p>Cargando inventario...</p>}>
          <StockTable variants={variantsWithColorName} colors={colors} />
        </Suspense>
      </div>
    </>
  )
}
