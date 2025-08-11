"use client";

import { deleteProduct } from "@/_actions/actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Submit } from "@/components/submit";

export const DeleteProduct = ({ id, img, img2, img3, img4, img5, img6, img7, img8, img9, img10 }: { id: number; img: string, img2: string, img3?: string, img4?: string, img5?: string, img6?: string, img7?: string, img8?: string, img9?: string, img10?: string }) => {
  const [open, setOpen] = useState(false);
  const handleAction = async (formData: FormData) => {
    await deleteProduct(formData);
    setOpen(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas totalmente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede ser desecha. Al aceptar borraras el producto de
            forma permanente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <form action={handleAction}>
            <input type="hidden" name="img" value={img} />
            <input type="hidden" name="img2" value={img2} />
            <input type="hidden" name="img3" value={img3} />
            <input type="hidden" name="img4" value={img4} />
            <input type="hidden" name="img5" value={img5} />
            <input type="hidden" name="img6" value={img6} />
            <input type="hidden" name="img7" value={img7} />
            <input type="hidden" name="img8" value={img8} />
            <input type="hidden" name="img9" value={img9} />
            <input type="hidden" name="img10" value={img10} />
            <input type="hidden" name="id" value={id} />
            <Submit text="Borrar" />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
