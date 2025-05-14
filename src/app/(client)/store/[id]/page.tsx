import { getProductById } from "@/_actions/actions"
import { getColors, getProductVariants } from "@/_actions/stock-actions"
import { redirect } from "next/navigation"
import { ProductDetail } from "@/components/productDetail"

type StoreProps = {
  params: Promise<{ id: string }>
}

export default async function Store({ params }: StoreProps) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    redirect("/store")
  }

  // Obtener colores y variantes para este producto
  const colors = await getColors()
  const variants = await getProductVariants(Number.parseInt(id))

  return <ProductDetail product={product} colors={colors} variants={variants} />
}
