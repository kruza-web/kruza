"use client"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ruler } from "lucide-react"

const sizeChartData = [
  {
    size: "S",
    bust: "86-90",
    waist: "64-68",
    hip: "90-94",
  },
  {
    size: "M",
    bust: "90-94",
    waist: "68-72",
    hip: "94-98",
  },
  {
    size: "L",
    bust: "94-98",
    waist: "72-76",
    hip: "98-102",
  },
]

export function SizeChartModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Tabla de Talles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Tabla de Talles
          </DialogTitle>
          <DialogDescription>Medidas en centímetros. Estas son medidas corporales, no de la prenda.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold">Talle</TableHead>
                <TableHead className="text-center font-semibold">Busto (cm)</TableHead>
                <TableHead className="text-center font-semibold">Cintura (cm)</TableHead>
                <TableHead className="text-center font-semibold">Cadera (cm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeChartData.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="text-center font-medium">{row.size}</TableCell>
                  <TableCell className="text-center">{row.bust}</TableCell>
                  <TableCell className="text-center">{row.waist}</TableCell>
                  <TableCell className="text-center">{row.hip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Para obtener la medida correcta, mide tu cuerpo con una cinta métrica ajustada pero
            sin apretar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
