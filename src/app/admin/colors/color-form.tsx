"use client"

import type React from "react"

import { createColor } from "@/_actions/stock-actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Submit } from "@/components/submit"
import { useState } from "react"

export const ColorForm = () => {
  const [colorPreview, setColorPreview] = useState("#000000")

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorPreview(e.target.value)
  }

  return (
    <section className="rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Añadir Color</h2>
      <form action={createColor} className="space-y-6">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium">
            Nombre del Color
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Ej: Rojo, Azul, Negro"
            required
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label htmlFor="hexCode" className="block text-sm font-medium">
            Código de Color
          </Label>
          <div className="flex items-center gap-4">
            <Input
              type="color"
              name="hexCode"
              id="hexCode"
              value={colorPreview}
              onChange={handleColorChange}
              className="mt-1 w-20 h-10 p-1 rounded-md shadow-sm"
            />
            <Input
              type="text"
              value={colorPreview}
              onChange={(e) => setColorPreview(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm"
              placeholder="#000000"
            />
            <div
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: colorPreview }}
              aria-hidden="true"
            ></div>
          </div>
        </div>

        <div>
          <Submit className="w-full py-2 px-4 rounded-md shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" />
        </div>
      </form>
    </section>
  )
}
