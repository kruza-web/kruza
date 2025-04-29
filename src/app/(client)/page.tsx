import { getProducts } from "@/_actions/actions";
import banner1 from "../../../public/banner1.jpeg";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* BANNER RESPONSIVE */}
      <div className="w-screen overflow-hidden">
        {/* DESKTOP & TABLET */}
        <div className="hidden sm:block w-full h-[400px] relative lg:h-[1080px]">
          <Image
            src={banner1}
            alt="Banner horizontal"
            fill
            className="object-fill"
            priority
          />
        </div>
        {/* MÓVIL */}
        <div className="block sm:hidden w-screen h-[100vw] relative">
          <Image
            src={banner1}
            alt="Banner vertical"
            fill
            className="object-center rotate-90 origin-center"
            priority
          />
        </div>
      </div>

      <div className="my-12 ml-6">
        <h1> NUESTRA ROPITAHHHH</h1>
        <div >
          <ul className="m-8 grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard products={product} />
            </li>
          ))} 
            
          </ul>
        </div>
      </div>
    </>
  );
}
