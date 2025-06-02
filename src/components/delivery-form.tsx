"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveDeliveryInfo } from "@/_actions/user-actions"
import {toast} from "sonner"

interface DeliveryFormProps {
  email?: string
  onComplete: () => void
}

export function DeliveryForm({ email, onComplete }: DeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      toast("Debes iniciar sesión para continuar", {
        description: "Por favor, inicia sesión para guardar tu información de envío.",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await saveDeliveryInfo(formData)
      toast("Información guardada", {
        description: "Tus datos de envío han sido guardados correctamente",
      })
      onComplete()
    } catch (error) {
      toast("Error al guardar información", {
        description: "No se pudieron guardar los datos de envío",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-3">Información de envío</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="email" value={email || ""} />

        <div className="grid gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Ingresa tu número de teléfono" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="street">Calle</Label>
          <Input id="street" name="street" placeholder="Nombre de la calle" required />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="streetNumber">Número</Label>
            <Input id="streetNumber" name="streetNumber" type="number" placeholder="Número" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input id="postalCode" name="postalCode" placeholder="Código postal" required />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" placeholder="Ciudad" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="state">Provincia</Label>
          <Input id="state" name="state" placeholder="Provincia" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="indications">Indicaciones adicionales</Label>
          <Input id="indications" name="indications" placeholder="Indicaciones para el repartidor (opcional)" />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </Button>
      </form>
    </div>
  )
}
