import { getProducts } from "@/_actions/actions";
import { getAllProductsStockStatus } from "@/_actions/stock-actions";
import { StoreClient } from "@/components/storeClient";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Store({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category as string | undefined;

  const products = await getProducts();

  // Obtener el estado de stock de todos los productos
  const stockStatus = await getAllProductsStockStatus();

  // Crear un mapa para acceder rápidamente al estado de stock por ID de producto
  const stockMap = new Map();
  stockStatus.forEach((status) => {
    stockMap.set(status.productId, status);
  });

  // Combinar los productos con su información de stock
  const productsWithStockInfo = products.map((product) => {
    const stock = stockMap.get(product.id);
    return {
      ...product,
      soldOut: stock ? stock.soldOut : true,
      discount: product.discount ?? 0,
    };
  });

  return (
    <StoreClient
      initialProducts={productsWithStockInfo}
      initialCategory={categoryParam}
    />
  );
}
