import ProductItem from "../components/product-item"
import { Card } from "@/components/ui/card"
import Link from "next/link"

type Product = {
  id: number,
  title: string,
  price: number,
  img: string,
  size: string,
}

export default function SearchResults({ products }:{ products:Product[]}) {
  return (
    <Card className="w-full p-2 shadow-lg">
      <div className="space-y-2">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {products.length > 0 && (
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm font-medium">
            Ver todos los resultados
          </Link>
        </div>
      )}

      {products.length === 0 && (
        <div className="py-4 text-center text-sm">No se encontraron resultados</div>
      )}
    </Card>
  )
}

