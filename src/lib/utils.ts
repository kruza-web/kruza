import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

// Función para calcular el precio con descuento
export function calculateDiscountedPrice(price: number, discount = 0) {
  if (discount <= 0) return price
  return price - (price * discount) / 100
}

// Función para verificar si un producto está agotado
export function isProductSoldOut(size: string) {
  const sizes = size
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s)
  return sizes.length === 0
}
