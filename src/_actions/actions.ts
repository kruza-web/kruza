"use server"

import { v2 as cloudinary } from "cloudinary"
import z from "zod"
import {
  adminsTable,
  editProductSchema,
  productSchema,
  productsTable,
  usersToProducts,
  usersTable,
  productVariantsTable,
} from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { SelectUserToProduct } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth"
import type { Items } from "mercadopago/dist/clients/commonTypes"

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const uploadEndpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!

const getSignature = () => {
  const timestamp = Math.round(Date.now() / 1000).toString()
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder: "k3y-shop" }, cloudinaryConfig.api_secret!)
  return { timestamp, signature }
}

const uploadFile = async ({
  file,
  signature,
  timestamp,
  folder = "k3y-shop",
}: {
  file: File
  signature: string
  timestamp: string
  folder?: string
}) => {
  const cloudinaryFormData = new FormData()
  cloudinaryFormData.append("file", file)
  cloudinaryFormData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
  cloudinaryFormData.append("signature", signature)
  cloudinaryFormData.append("timestamp", timestamp)
  cloudinaryFormData.append("folder", folder)

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: cloudinaryFormData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Cloudinary error response:", errorText)
    throw new Error("cloudinary fetch failed")
  }

  const cldData = await response.json()
  const data = z.object({ secure_url: z.string(), public_id: z.string() }).parse(cldData)

  return data
}

export const isAdmin = async (email: string) => {
  return (await db.select().from(adminsTable).where(eq(adminsTable.email, email))).length !== 0
}

export const getProducts = async (options: Partial<{ recommended: boolean }> = { recommended: false }) => {
  if (!options.recommended) return await db.select().from(productsTable)
  return await db.select().from(productsTable).where(eq(productsTable.isRecommended, options.recommended))
}

export const createProduct = async (formData: FormData) => {
  const file = formData.get("img") as File | null
  const file2 = formData.get("img2") as File | null
  const file3 = formData.get("img3") as File | null
  const file4 = formData.get("img4") as File | null

  const entries = Array.from(formData.entries()).filter(([key]) => !["img", "img2", "img3", "img4"].includes(key))
  const parsed = productSchema.parse(Object.fromEntries(entries))

  const { price, discount, size, isRecommended, ...rest } = parsed
  const sizes = formData.getAll("size") as string[]

  let publicId = ""
  let publicId2 = ""
  let publicId3 = ""
  let publicId4 = ""

  if (file instanceof File && file.size > 0) {
    const { signature, timestamp } = getSignature()
    const data = await uploadFile({ file, signature, timestamp })
    publicId = data.public_id
  }

  if (file2 instanceof File && file2.size > 0) {
    const { signature, timestamp } = getSignature()
    const data = await uploadFile({ file: file2, signature, timestamp })
    publicId2 = data.public_id
  }

  if (file3 instanceof File && file3.size > 0) {
    const { signature, timestamp } = getSignature()
    const data = await uploadFile({ file: file3, signature, timestamp })
    publicId3 = data.public_id
  }

  if (file4 instanceof File && file4.size > 0) {
    const { signature, timestamp } = getSignature()
    const data = await uploadFile({ file: file4, signature, timestamp })
    publicId4 = data.public_id
  }

  await db.insert(productsTable).values({
    ...rest,
    img: publicId,
    img2: publicId2,
    img3: publicId3,
    img4: publicId4,
    isRecommended: Boolean(isRecommended),
    size: sizes.join(", "),
    price: Number(price),
    discount: discount ? Number(discount) : 0, // Manejar el campo de descuento
  })
  revalidatePath("/")
}

export const deleteProduct = async (formData: FormData) => {
  const { id, img, img2, img3, img4 } = z
    .object({
      id: z.string(),
      img: z.string(),
      img2: z.string(),
      img3: z.string(),
      img4: z.string(),
    })
    .parse(Object.fromEntries(formData))

  // 1. Borra variantes relacionadas
  await db.delete(productVariantsTable).where(eq(productVariantsTable.productId, Number.parseInt(id)))

  // 2. Borra otras relaciones si existen (ejemplo: usersToProducts)
  await db.delete(usersToProducts).where(eq(usersToProducts.productId, Number.parseInt(id)))

  await Promise.all([
    db.delete(productsTable).where(eq(productsTable.id, Number.parseInt(id))),
    cloudinary.uploader.destroy(img),
    cloudinary.uploader.destroy(img2),
    cloudinary.uploader.destroy(img3),
    cloudinary.uploader.destroy(img4),
  ])
  revalidatePath("/")
}

export const editProduct = async (formData: FormData) => {
  const file = formData.get("img") as File | null
  const file2 = formData.get("img2") as File | null
  const file3 = formData.get("img3") as File | null
  const file4 = formData.get("img4") as File | null

  const origPublicId = formData.get("publicId") as string
  const origPublicId2 = formData.get("publicId2") as string
  const origPublicId3 = formData.get("publicId3") as string
  const origPublicId4 = formData.get("publicId4") as string

  const entries = Array.from(formData.entries()).filter(
    ([key]) => !["img", "img2", "img3", "img4", "publicId", "publicId2", "publicId3", "publicId4"].includes(key),
  )
  const parsed = editProductSchema.parse(Object.fromEntries(entries))

  const { title, id, description, price, discount, isRecommended, category } = parsed

  const sizes = formData.getAll("size") as string[]

  let newPublicId = origPublicId
  let newPublicId2 = origPublicId2
  let newPublicId3 = origPublicId3
  let newPublicId4 = origPublicId4

  if (file instanceof File && file.size > 0 && origPublicId) {
    cloudinary.uploader.destroy(origPublicId)
    const { signature, timestamp } = getSignature()
    const { public_id } = await uploadFile({ file, signature, timestamp })
    newPublicId = public_id
  }

  if (file2 instanceof File && file2.size > 0 && origPublicId2) {
    cloudinary.uploader.destroy(origPublicId2)
    const { signature, timestamp } = getSignature()
    const { public_id } = await uploadFile({
      file: file2,
      signature,
      timestamp,
    })
    newPublicId2 = public_id
  }

  if (file3 instanceof File && file3.size > 0 && origPublicId3) {
    cloudinary.uploader.destroy(origPublicId3)
    const { signature, timestamp } = getSignature()
    const { public_id } = await uploadFile({
      file: file3,
      signature,
      timestamp,
    })
    newPublicId3 = public_id
  }

  if (file4 instanceof File && file4.size > 0 && origPublicId4) {
    cloudinary.uploader.destroy(origPublicId4)
    const { signature, timestamp } = getSignature()
    const { public_id } = await uploadFile({
      file: file4,
      signature,
      timestamp,
    })
    newPublicId4 = public_id
  }

  await db
    .update(productsTable)
    .set({
      title,
      description,
      category,
      isRecommended: Boolean(isRecommended),
      img: newPublicId,
      img2: newPublicId2,
      img3: newPublicId3,
      img4: newPublicId4,
      price: Number(price),
      discount: discount ? Number(discount) : 0, // Manejar el campo de descuento
      size: sizes.join(", "),
    })
    .where(eq(productsTable.id, Number.parseInt(id)))

  revalidatePath("/admin/products")
}

export const changeStatus = async ({
  id,
  status,
}: {
  status: SelectUserToProduct["status"]
  id: SelectUserToProduct["id"]
}) => {
  await db.update(usersToProducts).set({ status }).where(eq(usersToProducts.id, id))
  revalidatePath("/admin/orders")
}

export const getOrders = async () => {
  return await db.query.usersToProducts.findMany({
    with: {
      user: true,
      product: true,
    },
  })
}

export const getUsers = async () => {
  return await db.select().from(usersTable)
}

export const getUser = async () => {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return

  return await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  })
}

export const buy = async ({
  email,
  delivery,
  variants,
}: {
  email: string
  delivery: boolean
  variants?: Array<{ productId: number; variantId: number; quantity: number }>
}) => {
  console.log("=== FUNCIÓN BUY INICIADA ===")
  console.log("Email:", email)
  console.log("Delivery:", delivery)
  console.log("Variants recibidos:", JSON.stringify(variants, null, 2))

  if (!variants || variants.length === 0) {
    console.error("❌ No se encontraron variantes en los metadatos. No se puede crear la orden.")
    return
  }

  let userId
  const users = await db.select().from(usersTable).where(eq(usersTable.email, email))

  if (users.length === 0) {
    console.log("Usuario no existe, creando nuevo usuario...")
    const [{ id }] = await db
      .insert(usersTable)
      .values({ email, name: email.split("@")[0] })
      .returning()
    userId = id
    console.log("Nuevo usuario creado con ID:", userId)
  } else {
    userId = users[0].id
    console.log("Usuario existente encontrado con ID:", userId)
  }

  try {
    // Preparar los datos para insertar desde las variantes
    const ordersToInsert = variants.map(({ productId, variantId, quantity }) => {
      const orderData = {
        productId,
        userId,
        quantity,
        delivery,
        variantId: variantId || null,
      }
      console.log("Preparando orden:", JSON.stringify(orderData, null, 2))
      return orderData
    })

    console.log("=== INSERTANDO ÓRDENES ===")
    console.log("Órdenes a insertar:", JSON.stringify(ordersToInsert, null, 2))

    const insertedOrders = await db.insert(usersToProducts).values(ordersToInsert).returning()

    console.log("✅ Órdenes insertadas exitosamente:")
    console.log("Órdenes creadas:", JSON.stringify(insertedOrders, null, 2))

    revalidatePath("/admin/orders")
    revalidatePath("/")

    return { success: true, orders: insertedOrders }
  } catch (error) {
    console.error("❌ Error al insertar órdenes:", error)
    throw error
  }
}

export const getProductById = async (id: string) => {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, Number.parseInt(id)),
  })
  if (!product) throw new Error("Product not found")
  return product
}

export const editUser = async (formData: FormData) => {
  const { id, streetNumber, dni, ...data } = z
    .object({
      id: z.string(),
      phone: z.string(),
      dni: z.string().optional(),
      postalCode: z.string().optional(),
      street: z.string().optional(),
      streetNumber: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      indications: z.string().optional(),
    })
    .parse(Object.fromEntries(formData))

  await db
    .update(usersTable)
    .set({
      streetNumber: streetNumber ? Number.parseInt(streetNumber) : null,
      dni: dni ? Number.parseInt(dni) : null,
      ...data,
    })
    .where(eq(usersTable.id, Number.parseInt(id)))
  revalidatePath("/")
}

export const getUserOrders = async (userId: number) => {
  return await db.query.usersToProducts.findMany({
    with: { product: true, user: true },
    where: eq(usersToProducts.userId, userId),
  })
}
