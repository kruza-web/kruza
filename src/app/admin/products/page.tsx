import { getProducts } from "@/_actions/actions";
import { CreateProduct } from "./createProduct";
import { Product } from "./product";
import { Suspense } from "react";

const Products = async () => {
  const products = await getProducts();

  return (
    <ul className="container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="m-6">
          <Product {...product} />
        </li>
      ))}
    </ul>
  );
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <p className="mt-4 text-lg">Administra tus productos acá.</p>
      </div>
      <CreateProduct />
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">
          Lista de Productos
        </h2>
        <Suspense fallback={<p>Cargando productos...</p>}>
          <Products />
        </Suspense>
      </div>
    </>
  );
}
