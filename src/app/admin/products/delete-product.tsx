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

export const DeleteProduct = ({ id, img }: { id: number; img: string }) => {
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
            <input type="hidden" name="id" value={id} />
            <Submit text="Borrar" />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
