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
          <Link key={product.id} href={`/store/${product.id}`}>
            <CarouselItem className="sm:basis-1/2 lg:basis-1/3">
              <ProductCard
                products={{
                  ...product,
                  discount: product.discount ?? 0,
                }}
              />
            </CarouselItem>
          </Link>
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
