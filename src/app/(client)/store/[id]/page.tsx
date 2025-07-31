import { getProductById } from "@/_actions/actions";
import { getColors, getProductVariants } from "@/_actions/stock-actions";
import { redirect } from "next/navigation";
import { ProductDetail } from "@/components/productDetail";
import { CarrouselProducts } from "@/components/carrouselProducts";

type StoreProps = {
  params: Promise<{ id: string }>;
};

export default async function Store({ params }: StoreProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    redirect("/store");
  }

  // Obtener colores y variantes para este producto
  const colors = await getColors();
  const variants = await getProductVariants(Number.parseInt(id));

  return (
    <div className="flex flex-col gap-12 mt-36">
    {/* Sección Detalle del Producto */}
    <section className="w-full">
      <ProductDetail product={product} colors={colors} variants={variants} />
    </section>

    {/* Sección Productos Relacionados */}
    <section className="w-full m-4">
      <div className="h-20">
        <h2 className="text-2xl ml-2 font-bold">Descubrí más productos</h2>
      </div>
      <CarrouselProducts />
    </section>
  </div>
  );
}
