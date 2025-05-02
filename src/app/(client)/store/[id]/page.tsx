import { getProductById } from "@/_actions/actions";
import { redirect } from "next/navigation";
import { ProductDetail } from "@/components/productDetail";

type StoreProps = {
  params: Promise<{ id: string }>;
};

export default async function Store({ params }: StoreProps) {
  const { id } = await params;
  console.log(id);

  const product = await getProductById(id);
  console.log(product);

  if (!product) {
    redirect("/store");
  }

  return <ProductDetail product={product} />;
}
