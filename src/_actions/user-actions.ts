"use server"

import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Esquema para validar los datos de envío (actualizado con DNI)
const deliveryInfoSchema = z.object({
  email: z.string().email("Email inválido"),
  dni: z.string().min(7, "El DNI debe tener al menos 7 dígitos").max(8, "El DNI debe tener máximo 8 dígitos"),
  phone: z.string().min(1, "El teléfono es requerido"),
  street: z.string().min(1, "La calle es requerida"),
  streetNumber: z.string().min(1, "El número es requerido"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "La provincia es requerida"),
  indications: z.string().optional(),
})

export async function saveDeliveryInfo(formData: FormData) {
  console.log("=== DATOS DEL FORMULARIO DE DELIVERY ===")
  console.log("FormData entries:", Object.fromEntries(formData))

  // Validar los datos del formulario
  const validatedData = deliveryInfoSchema.parse(Object.fromEntries(formData))

  console.log("Datos validados:", validatedData)

  const { email, dni, phone, street, streetNumber, postalCode, city, state, indications } = validatedData

  // Verificar si el usuario existe
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email))

  if (existingUser.length === 0) {
    // Si el usuario no existe, crear un nuevo registro
    const newUser = await db
      .insert(usersTable)
      .values({
        email,
        name: "", // El nombre podría venir de la sesión
        dni: Number.parseInt(dni),
        phone,
        street,
        streetNumber: Number.parseInt(streetNumber),
        postalCode,
        city,
        state,
        indications: indications || null,
      })
      .returning()

    console.log("Usuario creado:", newUser)
  } else {
    // Si el usuario existe, actualizar sus datos
    const updatedUser = await db
      .update(usersTable)
      .set({
        dni: Number.parseInt(dni),
        phone,
        street,
        streetNumber: Number.parseInt(streetNumber),
        postalCode,
        city,
        state,
        indications: indications || null,
      })
      .where(eq(usersTable.email, email))
      .returning()

    console.log("Usuario actualizado:", updatedUser)
  }

  revalidatePath("/")
  return { success: true }
}

export async function getUserDeliveryInfo(email: string) {
  if (!email) return null

  const user = await db.select().from(usersTable).where(eq(usersTable.email, email))

  if (user.length === 0) return null

  return user[0]
}

export async function hasDeliveryInfo(email: string): Promise<boolean> {
  if (!email) return false

  const user = await db
    .select({
      hasInfo: usersTable.street,
      hasDni: usersTable.dni,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

  return user.length > 0 && !!user[0].hasInfo && !!user[0].hasDni
}
