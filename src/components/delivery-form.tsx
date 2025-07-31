"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveDeliveryInfo, getUserDeliveryInfo } from "@/_actions/user-actions"
import { toast } from "sonner"

interface DeliveryFormProps {
  email?: string
  onComplete: () => void
}

export function DeliveryForm({ email, onComplete }: DeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    dni: "",
    phone: "",
    street: "",
    streetNumber: "",
    postalCode: "",
    city: "",
    state: "",
    indications: "",
  })

  // Cargar datos existentes del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!email) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await getUserDeliveryInfo(email)
        if (userData) {
          setFormData({
            dni: userData.dni?.toString() || "",
            phone: userData.phone || "",
            street: userData.street || "",
            streetNumber: userData.streetNumber?.toString() || "",
            postalCode: userData.postalCode || "",
            city: userData.city || "",
            state: userData.state || "",
            indications: userData.indications || "",
          })

          // Si todos los datos están completos, llamar a onComplete automáticamente
          const isComplete =
            userData.dni &&
            userData.phone &&
            userData.street &&
            userData.streetNumber &&
            userData.postalCode &&
            userData.city &&
            userData.state

          if (isComplete) {
            onComplete()
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [email, onComplete])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      toast("Debes iniciar sesión para continuar", {
        description: "Por favor, inicia sesión para guardar tu información de envío.",
      })
      return
    }

    setIsSubmitting(true)

    const formDataToSend = new FormData(e.currentTarget)

    try {
      await saveDeliveryInfo(formDataToSend)
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

  // Verificar si todos los campos requeridos están completos
  const isFormComplete =
    formData.dni &&
    formData.phone &&
    formData.street &&
    formData.streetNumber &&
    formData.postalCode &&
    formData.city &&
    formData.state

  if (isLoading) {
    return (
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-3">Información de envío</h3>
        <div className="flex items-center justify-center py-4">
          <span className="text-sm text-muted-foreground">Cargando datos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-3">Información de envío</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="email" value={email || ""} />

        <div className="grid gap-1.5">
          <Label htmlFor="dni">DNI</Label>
          <Input
            id="dni"
            name="dni"
            type="number"
            placeholder="Ingresa tu DNI (sin puntos ni espacios)"
            value={formData.dni}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Ingresa tu número de teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="street">Calle</Label>
          <Input
            id="street"
            name="street"
            placeholder="Nombre de la calle"
            value={formData.street}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="streetNumber">Número</Label>
            <Input
              id="streetNumber"
              name="streetNumber"
              type="number"
              placeholder="Número"
              value={formData.streetNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="Código postal"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="state">Provincia</Label>
          <Input
            id="state"
            name="state"
            placeholder="Provincia"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="indications">Indicaciones adicionales</Label>
          <Input
            id="indications"
            name="indications"
            placeholder="Indicaciones para el repartidor (opcional)"
            value={formData.indications}
            onChange={handleInputChange}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !isFormComplete}>
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </Button>
      </form>
    </div>
  )
}
