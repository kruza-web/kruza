import { createProduct } from "@/_actions/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Submit } from "@/components/submit";

export const CreateProduct = () => {
  return (
    <section className="rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Añadir Producto</h2>
      <form action={createProduct} className="space-y-6">
        <div>
          <Label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Título del producto"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </Label>
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="Descripción del producto"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Precio
          </Label>
          <Input
            type="number"
            name="price"
            id="price"
            placeholder="4999"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label
            htmlFor="img"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen
          </Label>
          <Input
            type="file"
            name="img"
            id="picture"
            accept="image/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Talles
          </Label>
          <div className="flex gap-4 mt-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_recommended"
            name="isRecommended"
            defaultChecked
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="is_recommended" className="text-sm">
            Es recomendado
          </label>
        </div>

        <div>
          <Submit className="w-full text-white py-2 px-4 rounded-md shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" />
        </div>
      </form>
    </section>
  );
};
