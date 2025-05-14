"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteColor } from "@/_actions/stock-actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { SelectColor } from "@/db/schema"

export const ColorList = ({ id, name, hexCode }: SelectColor) => {
  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que deseas eliminar el color ${name}?`)) {
      await deleteColor(id)
    }
  }

  return (
    <Card className="w-full max-w-sm overflow-hidden" key={id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{hexCode}</CardDescription>
        </div>
        <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: hexCode }} aria-hidden="true"></div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
