import { getProducts } from "@/_actions/actions"
import { ProductCard } from "@/components/product-card"

export default async function Store(){
    const products = await getProducts()
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <ul className="flex flex-wrap items-center justify-center w-full max-w-5xl p-4">
                {products.map((product) => (
                    <li key={product.id}>
                        <ProductCard products={{...product, quantity: 0}} />
                    </li>
                ))}
            </ul>
        </div>
    )
}