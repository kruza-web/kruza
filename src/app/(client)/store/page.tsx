import { getProducts } from "@/_actions/actions"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

export default async function Store(){
    const products = await getProducts()
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-16 text-center">Tienda</h1>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-8">
                {products.map((product) => (
                    <Link key={product.id} href={`/store/${product.id}`}>
                    <li key={product.id}>
                        <ProductCard products={{...product, quantity: 0}} />
                    </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}