import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts } from "@/_actions/actions";
import Link from "next/link";
import { ProductCard } from "./product-card";

export const CarrouselProducts = async () => {
  const products = await getProducts();

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="mb-6 w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
            <Link href={`/store/${product.id}`} className="block group">
              <ProductCard
                products={{
                  ...product,
                  discount: product.discount ?? 0,
                }}
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {products.length > 3 && (
        <>
          <CarouselPrevious className="hidden lg:inline-flex" />
          <CarouselNext className="hidden lg:inline-flex" />
        </>
      )}
    </Carousel>
  );
};
