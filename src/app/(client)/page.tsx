import { getProducts } from "@/_actions/actions";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1>K3Y-SHOP</h1>
      <h2 className="mt-12">PROXIMAMENTE...</h2>
    </div>
  );
}
