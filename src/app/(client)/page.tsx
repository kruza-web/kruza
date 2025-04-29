import { getProducts } from "@/_actions/actions";
import banner1 from "../../../public/banner1.jpeg";
import Image from "next/image";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* BANNER RESPONSIVE */}
      <div className="w-screen overflow-hidden">
        {/* DESKTOP & TABLET */}
        <div className="hidden sm:block w-full h-[400px] relative lg:h-[800px]">
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

      <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1>K3Y-SHOP</h1>
        <h2 className="mt-12">PROXIMAMENTE...</h2>
      </div>
    </>
  );
}
