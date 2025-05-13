"use client";
import { editProduct } from "@/_actions/actions";
import { SelectProduct } from "@/db/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Submit } from "@/components/submit";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export const EditProduct = ({
  id,
  title,
  description,
  img,
  img2,
  img3,
  price,
  size,
  isRecommended,
}: SelectProduct) => {
  const [open, setOpen] = useState(false);
  const handleAction = async (formData: FormData) => {
    await editProduct(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"secondary"}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit products</DialogTitle>
          <DialogDescription>
            Edit your profile here.
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction}>
          <div className="w-fullitems-center grid gap-1.5">
            <Label
              htmlFor="edit_title"
              className="block text-sm font-medium text-gray-700"
            >
              Título
            </Label>
            <Input
                type="text"
              name="title"
              id="edit_title"
              placeholder="Título del producto"
              defaultValue={title}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="edit_description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </Label>
            <Input
              type="text"
              name="description"
              id="edit_description"
              placeholder="Descripción del producto"
              defaultValue={description ?? ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
          <Label htmlFor="category" className="block text-sm font-medium ">
            Categoría
          </Label>
          <Select name="category" required>
            <SelectTrigger className="w-[180px]">
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

          <div>
            <Label
              htmlFor="edit_price"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </Label>
            <Input
              type="number"
              name="price"
              id="edit_price"
              placeholder="4999"
              defaultValue={price}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="edit_picture"
              className="block text-sm font-medium text-gray-700"
            >
              Imagen
            </Label>
            <Input
              type="file"
              name="img"
              id="edit_picture"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>

          <div>
            <Label
              htmlFor="edit_picture2"
              className="block text-sm font-medium text-gray-700"
            >
              Imagen
            </Label>
            <Input
              type="file"
              name="img2"
              id="edit_picture2"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>

          <div>
            <Label
              htmlFor="edit_picture3"
              className="block text-sm font-medium text-gray-700"
            >
              Imagen
            </Label>
            <Input
              type="file"
              name="img3"
              id="edit_picture3"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>

          <div>
            <Label
              htmlFor="edit_size"
              className="block text-sm font-medium text-gray-700"
            >
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
              id="edit_is_recommended"
              name="isRecommended"
              defaultChecked={isRecommended}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="edit_is_recommended" className="text-sm">
              Es recomendado
            </label>
          </div>
          <input type="hidden" name="publicId" value={img} required />
          <input type="hidden" name="publicId2" value={img2} required />
          <input type="hidden" name="publicId3" value={img3} required />
          <input type="hidden" name="id" value={id} required />
            <Submit className="w-full text-white py-2 px-4 rounded-md shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" />
        </form>
      </DialogContent>
    </Dialog>
  );
};
