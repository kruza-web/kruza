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
    <Card className="w-full p-2 shadow-none border-1 border-gray-500/30 bg-transparent gap-1">
      <div className="space-y-2">
        {products.map((product) => (
          <Link key={product.id} href={`/store/${product.id}`}>
          <ProductItem product={product} />
          </Link>
        ))}
      </div>

      {products.length > 0 && (
        <div className="text-center hover:bg-gray-500/10 rounded-3xl pb-2">
          <Link href="/store" className="text-sm font-medium">
            Ir a la tienda
          </Link>
        </div>
      )}

      {products.length === 0 && (
        <div className="py-4 text-center text-sm">No se encontraron resultados</div>
      )}
    </Card>
  )
}

