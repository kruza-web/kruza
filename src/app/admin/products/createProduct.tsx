import { createProduct } from "@/_actions/actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Submit } from "@/components/submit"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const CreateProduct = () => {
  return (
    <section className="rounded-lg p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Añadir Producto</h2>
      <form action={createProduct} className="space-y-6">
        <div>
          <Label htmlFor="title" className="block text-sm font-medium">
            Título
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Título del producto"
            required
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label htmlFor="description" className="block text-sm font-medium">
            Descripción
          </Label>
          <Textarea
            name="description"
            id="description"
            placeholder="Descripción del producto"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto min-h-[80px] max-h-[200px]"
          />
        </div>

        <div>
          <Label htmlFor="category" className="block text-sm font-medium">
            Categoría
          </Label>
          <Select name="category" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top" id="top">
                Top
              </SelectItem>
              <SelectItem value="bottom" id="bottom">
                Bottom
              </SelectItem>
              <SelectItem value="vestidos" id="vestidos">
                Vestidos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price" className="block text-sm font-medium">
            Precio
          </Label>
          <Input
            type="number"
            name="price"
            id="price"
            placeholder="4999"
            required
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label htmlFor="discount" className="block text-sm font-medium">
            Descuento (%)
          </Label>
          <Input
            type="number"
            name="discount"
            id="discount"
            placeholder="0"
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Deja en blanco o 0 si no hay descuento</p>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-3">Imágenes del Producto</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="img" className="block text-sm font-medium">
                Imagen #1
              </Label>
              <Input
                type="file"
                name="img"
                id="img"
                accept="image/*"
                required
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img2" className="block text-sm font-medium">
                Imagen #2
              </Label>
              <Input
                type="file"
                name="img2"
                id="img2"
                accept="image/*"
                required
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img3" className="block text-sm font-medium">
                Imagen #3
              </Label>
              <Input
                type="file"
                name="img3"
                id="img3"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img4" className="block text-sm font-medium">
                Imagen #4
              </Label>
              <Input
                type="file"
                name="img4"
                id="img4"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img5" className="block text-sm font-medium">
                Imagen #5
              </Label>
              <Input
                type="file"
                name="img5"
                id="img5"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img6" className="block text-sm font-medium">
                Imagen #6
              </Label>
              <Input
                type="file"
                name="img6"
                id="img6"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img7" className="block text-sm font-medium">
                Imagen #7
              </Label>
              <Input
                type="file"
                name="img7"
                id="img7"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img8" className="block text-sm font-medium">
                Imagen #8
              </Label>
              <Input
                type="file"
                name="img8"
                id="img8"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img9" className="block text-sm font-medium">
                Imagen #9
              </Label>
              <Input
                type="file"
                name="img9"
                id="img9"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="img10" className="block text-sm font-medium">
                Imagen #10
              </Label>
              <Input
                type="file"
                name="img10"
                id="img10"
                accept="image/*"
                className="mt-1 block w-full text-xs file:mr-4 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="size" className="block text-sm font-medium">
            Talles
          </Label>
          <div className="flex gap-4 mt-2">
            {["S", "M", "L", "Único"].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <Checkbox id={size} name="size" value={size} className="h-4 w-4 rounded border-gray-300" />
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
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="is_recommended" className="text-sm">
            Es recomendado
          </label>
        </div>

        <div>
          <Submit className="w-full py-2 px-4 rounded-md shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" />
        </div>
      </form>
    </section>
  )
}
