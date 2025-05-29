"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProductStock, deleteProductVariant } from "@/_actions/stock-actions"
import { useState } from "react"
import { Trash2, Edit, Save, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { SelectProductVariant, SelectColor } from "@/db/schema"

interface StockTableProps {
  variants: (SelectProductVariant & { colorName: string })[]
  colors: SelectColor[]
}

export const StockTable = ({ variants, colors }: StockTableProps) => {
  const [editMode, setEditMode] = useState<Record<number, boolean>>({})
  const [stockValues, setStockValues] = useState<Record<number, number>>({})

  const handleEdit = (variantId: number, currentStock: number) => {
    setEditMode({ ...editMode, [variantId]: true })
    setStockValues({ ...stockValues, [variantId]: currentStock })
  }

  const handleCancel = (variantId: number) => {
    setEditMode({ ...editMode, [variantId]: false })
  }

  const handleStockChange = (variantId: number, value: string) => {
    const stock = Number.parseInt(value)
    if (!isNaN(stock) && stock >= 0) {
      setStockValues({ ...stockValues, [variantId]: stock })
    }
  }

  const handleSave = async (variant: SelectProductVariant) => {
    const newStock = stockValues[variant.id]

    await updateProductStock({
      productId: variant.productId,
      colorId: variant.colorId,
      size: variant.size,
      stock: newStock,
    })

    setEditMode({ ...editMode, [variant.id]: false })
  }

  const handleDelete = async (variant: SelectProductVariant) => {
    await deleteProductVariant(variant.id)
  }

  const getColorName = (colorId: number) => {
    const color = colors.find((c) => c.id === colorId)
    return color ? color.name : "Desconocido"
  }

  const getColorHex = (colorId: number) => {
    const color = colors.find((c) => c.id === colorId)
    return color ? color.hexCode : "#CCCCCC"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Talle</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No hay variantes de stock configuradas para este producto.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getColorHex(variant.colorId) }}
                    ></div>
                    {getColorName(variant.colorId)}
                  </div>
                </TableCell>
                <TableCell>{variant.size}</TableCell>
                <TableCell>
                  {editMode[variant.id] ? (
                    <Input
                      type="number"
                      min="0"
                      value={stockValues[variant.id]}
                      onChange={(e) => handleStockChange(variant.id, e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    <span className={variant.stock === 0 ? "text-red-500 font-bold" : ""}>{variant.stock}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editMode[variant.id] ? (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={() => handleSave(variant)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCancel(variant.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(variant.id, variant.stock)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente la variante de stock para{" "}
                              <strong>
                                {getColorName(variant.colorId)} - {variant.size}
                              </strong>
                              . Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(variant)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
