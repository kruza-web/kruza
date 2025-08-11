"use client"
import { editProduct } from "@/_actions/actions"
import type { SelectProduct } from "@/db/schema"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Submit } from "@/components/submit"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const EditProduct = ({
  id,
  title,
  description,
  img,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  price,
  discount = 0,
  size,
  isRecommended,
  category,
}: SelectProduct) => {
  const [open, setOpen] = useState(false)
  const handleAction = async (formData: FormData) => {
    await editProduct(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"secondary"}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[98vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>Edit products</DialogTitle>
          <DialogDescription>Edit your profile here.</DialogDescription>
        </DialogHeader>
        <form action={handleAction} className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit_title" className="text-sm font-medium">
                Título
              </Label>
              <Input
                type="text"
                name="title"
                id="edit_title"
                placeholder="Título del producto"
                defaultValue={title}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoría
              </Label>
              <Select name="category" defaultValue={category} required>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              name="description"
              id="edit_description"
              placeholder="Descripción del producto"
              defaultValue={description ?? ""}
              required
              className="mt-1 block max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto min-h-[80px] max-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit_price" className="text-sm font-medium">
                Precio
              </Label>
              <Input
                type="number"
                name="price"
                id="edit_price"
                placeholder="4999"
                defaultValue={price}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_discount" className="text-sm font-medium">
                Descuento (%)
              </Label>
              <Input
                type="number"
                name="discount"
                id="edit_discount"
                placeholder="0"
                min="0"
                max="100"
                defaultValue={discount ?? 0}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Deja en blanco o 0 si no hay descuento</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Imágenes del producto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit_picture" className="text-sm font-medium">
                  Imagen principal
                </Label>
                <Input type="file" name="img" id="edit_picture" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture2" className="text-sm font-medium">
                  Imagen 2
                </Label>
                <Input type="file" name="img2" id="edit_picture2" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture3" className="text-sm font-medium">
                  Imagen 3
                </Label>
                <Input type="file" name="img3" id="edit_picture3" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture4" className="text-sm font-medium">
                  Imagen 4
                </Label>
                <Input type="file" name="img4" id="edit_picture4" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture5" className="text-sm font-medium">
                  Imagen 5
                </Label>
                <Input type="file" name="img5" id="edit_picture5" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture6" className="text-sm font-medium">
                  Imagen 6
                </Label>
                <Input type="file" name="img6" id="edit_picture6" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture7" className="text-sm font-medium">
                  Imagen 7
                </Label>
                <Input type="file" name="img7" id="edit_picture7" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture8" className="text-sm font-medium">
                  Imagen 8
                </Label>
                <Input type="file" name="img8" id="edit_picture8" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture9" className="text-sm font-medium">
                  Imagen 9
                </Label>
                <Input type="file" name="img9" id="edit_picture9" accept="image/*" className="w-full text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_picture10" className="text-sm font-medium">
                  Imagen 10
                </Label>
                <Input type="file" name="img10" id="edit_picture10" accept="image/*" className="w-full text-xs" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_size" className="text-sm font-medium">
              Talles disponibles
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {["S", "M", "L", "Único"].map((sizeOption) => {
                const isChecked = size
                  .split(",")
                  .map((s) => s.trim())
                  .includes(sizeOption)

                return (
                  <label key={sizeOption} className="flex items-center space-x-1 text-xs">
                    <input
                      type="checkbox"
                      name="size"
                      value={sizeOption}
                      defaultChecked={isChecked}
                      className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{sizeOption}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="edit_is_recommended" name="isRecommended" defaultChecked={isRecommended} />
            <Label htmlFor="edit_is_recommended" className="text-sm">
              Marcar como producto recomendado
            </Label>
          </div>

          <input type="hidden" name="publicId" value={img ?? ""} required />
          <input type="hidden" name="publicId2" value={img2 ?? ""} required />
          <input type="hidden" name="publicId3" value={img3 ?? ""} required />
          <input type="hidden" name="publicId4" value={img4 ?? ""} required />
          <input type="hidden" name="publicId5" value={img5 ?? ""} required />
          <input type="hidden" name="publicId6" value={img6 ?? ""} required />
          <input type="hidden" name="publicId7" value={img7 ?? ""} required />
          <input type="hidden" name="publicId8" value={img8 ?? ""} required />
          <input type="hidden" name="publicId9" value={img9 ?? ""} required />
          <input type="hidden" name="publicId10" value={img10 ?? ""} required />
          <input type="hidden" name="id" value={id} required />

          <div className="pt-4">
            <Submit className="w-full" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
