"use client"

import { updateProductStock } from "@/_actions/stock-actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Submit } from "@/components/submit"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { SelectColor } from "@/db/schema"

interface StockFormProps {
  productId: number
  colors: SelectColor[]
  sizes: string[]
}

export const StockForm = ({ productId, colors, sizes }: StockFormProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")

  const handleSubmit = async (formData: FormData) => {
    const colorId = Number.parseInt(formData.get("colorId") as string)
    const size = formData.get("size") as string
    const stock = Number.parseInt(formData.get("stock") as string)

    await updateProductStock({
      productId,
      colorId,
      size,
      stock,
    })

    // Resetear el formulario
    setSelectedColor("")
    setSelectedSize("")
  }

  return (
    <section className="rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Actualizar Stock</h2>
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="productId" value={productId} />

        <div>
          <Label htmlFor="colorId" className="block text-sm font-medium">
            Color
          </Label>
          <Select name="colorId" value={selectedColor} onValueChange={setSelectedColor} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hexCode }}></div>
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size" className="block text-sm font-medium">
            Talle
          </Label>
          <Select name="size" value={selectedSize} onValueChange={setSelectedSize} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un talle" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stock" className="block text-sm font-medium">
            Cantidad en Stock
          </Label>
          <Input
            type="number"
            name="stock"
            id="stock"
            min="0"
            placeholder="0"
            required
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Submit className="w-full py-2 px-4 rounded-md shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" />
        </div>
      </form>
    </section>
  )
}
