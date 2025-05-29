"use server"

import { db } from "@/db"
import { colorsTable, productVariantsTable, productsTable } from "@/db/schema"
import { eq, and, sum } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { SelectColor, SelectProductVariant } from "@/db/schema"

import type { StockStatus } from "@/lib/check-stock"

// Obtener todos los colores
export const getColors = async (): Promise<SelectColor[]> => {
  return await db.select().from(colorsTable)
}

// Crear un nuevo color
export const createColor = async (formData: FormData) => {
  const name = formData.get("name") as string
  const hexCode = formData.get("hexCode") as string

  const colorData = z
    .object({
      name: z.string().min(1, "El nombre es requerido"),
      hexCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Código de color hexadecimal inválido"),
    })
    .parse({ name, hexCode })

  await db.insert(colorsTable).values(colorData)
  revalidatePath("/admin/colors")
}

// Eliminar un color
export const deleteColor = async (id: number) => {
  // Primero verificar si el color está siendo utilizado en alguna variante
  const variants = await db.select().from(productVariantsTable).where(eq(productVariantsTable.colorId, id))

  if (variants.length > 0) {
    throw new Error("No se puede eliminar el color porque está siendo utilizado en productos")
  }

  await db.delete(colorsTable).where(eq(colorsTable.id, id))
  revalidatePath("/admin/colors")
}

// Obtener variantes de un producto
export const getProductVariants = async (productId: number): Promise<SelectProductVariant[]> => {
  return await db.select().from(productVariantsTable).where(eq(productVariantsTable.productId, productId))
}

// Obtener variantes de un producto con nombres de color
export const getProductVariantsWithColorNames = async (productId: number) => {
  const variants = await db.select().from(productVariantsTable).where(eq(productVariantsTable.productId, productId))

  const colors = await db.select().from(colorsTable)

  return variants.map((variant) => {
    const color = colors.find((c) => c.id === variant.colorId)
    return {
      ...variant,
      colorName: color ? color.name : "Desconocido",
    }
  })
}

// Actualizar el stock de una variante de producto
export const updateProductStock = async ({
  productId,
  colorId,
  size,
  stock,
}: {
  productId: number
  colorId: number
  size: string
  stock: number
}) => {
  // Buscar si ya existe la variante
  const existingVariant = await db
    .select()
    .from(productVariantsTable)
    .where(
      and(
        eq(productVariantsTable.productId, productId),
        eq(productVariantsTable.colorId, colorId),
        eq(productVariantsTable.size, size),
      ),
    )

  if (existingVariant.length > 0) {
    // Actualizar la variante existente
    await db.update(productVariantsTable).set({ stock }).where(eq(productVariantsTable.id, existingVariant[0].id))
  } else {
    // Crear una nueva variante
    await db.insert(productVariantsTable).values({
      productId,
      colorId,
      size,
      stock,
    })
  }

  revalidatePath(`/admin/products/${productId}/stock`)
  revalidatePath(`/store/${productId}`)
}

// Obtener un producto por ID (reutilizando la función existente)
export const getProductById = async (id: string) => {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, Number.parseInt(id)),
  })
  if (!product) throw new Error("Product not found")
  return product
}

// Reducir el stock cuando se realiza una compra
export const reduceStock = async (variantId: number, quantity: number) => {
  const variant = await db.select().from(productVariantsTable).where(eq(productVariantsTable.id, variantId))

  if (variant.length === 0) {
    throw new Error("Variante no encontrada")
  }

  const currentStock = variant[0].stock

  if (currentStock < quantity) {
    throw new Error("No hay suficiente stock disponible")
  }

  await db
    .update(productVariantsTable)
    .set({ stock: currentStock - quantity })
    .where(eq(productVariantsTable.id, variantId))
}

// Función para verificar si un producto está completamente agotado
export async function isProductSoldOut(productId: number): Promise<boolean> {
  // Obtener la suma total del stock para todas las variantes del producto
  const result = await db
    .select({ totalStock: sum(productVariantsTable.stock) })
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))

  // Si no hay resultados o el total es 0, el producto está agotado
  // Convertir explícitamente a número para evitar problemas de tipo
  return !result.length || Number(result[0].totalStock) === 0 || result[0].totalStock === null
}

// Función para obtener el stock total de un producto
export async function getProductTotalStock(productId: number): Promise<number> {
  const result = await db
    .select({ totalStock: sum(productVariantsTable.stock) })
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))

  // Convertir explícitamente a número para evitar problemas de tipo
  return result.length ? Number(result[0].totalStock) || 0 : 0
}

// Función para obtener el estado de stock de múltiples productos
export async function getProductsStockStatus(productIds: number[]): Promise<StockStatus[]> {
  if (!productIds.length) return []

  // Crear un array de promesas para verificar el stock de cada producto
  const stockPromises = productIds.map(async (id) => {
    const totalStock = await getProductTotalStock(id)
    return {
      productId: id,
      soldOut: totalStock === 0,
      totalStock,
    }
  })

  // Ejecutar todas las promesas en paralelo
  return Promise.all(stockPromises)
}

// Función para verificar el stock de todos los productos
export async function getAllProductsStockStatus(): Promise<StockStatus[]> {
  // Obtener todos los productos con variantes
  const variants = await db
    .select({
      productId: productVariantsTable.productId,
      stock: sum(productVariantsTable.stock),
    })
    .from(productVariantsTable)
    .groupBy(productVariantsTable.productId)

  // Mapear los resultados al formato StockStatus
  return variants.map((variant) => ({
    productId: variant.productId,
    soldOut: Number(variant.stock) === 0 || variant.stock === null,
    totalStock: Number(variant.stock) || 0,
  }))
}

// Eliminar una variante de producto
export const deleteProductVariant = async (variantId: number) => {
  try {
    // Obtener información de la variante antes de eliminarla para revalidar las rutas correctas
    const variant = await db.select().from(productVariantsTable).where(eq(productVariantsTable.id, variantId))

    if (variant.length === 0) {
      throw new Error("Variante no encontrada")
    }

    const productId = variant[0].productId

    // Eliminar la variante
    await db.delete(productVariantsTable).where(eq(productVariantsTable.id, variantId))

    // Revalidar las rutas para actualizar la UI
    revalidatePath(`/admin/products/${productId}/stock`)
    revalidatePath(`/store/${productId}`)
    revalidatePath("/store")
  } catch (error) {
    console.error("Error al eliminar la variante:", error)
    throw new Error("No se pudo eliminar la variante de stock")
  }
}

