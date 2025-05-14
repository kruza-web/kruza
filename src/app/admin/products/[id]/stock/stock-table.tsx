"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProductStock } from "@/_actions/stock-actions"
import { useState } from "react"
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
            <TableHead>Acciones</TableHead>
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
                <TableCell>
                  {editMode[variant.id] ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(variant)}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCancel(variant.id)}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(variant.id, variant.stock)}>
                      Editar
                    </Button>
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
