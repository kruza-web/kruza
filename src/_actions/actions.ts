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
import { eq, sql, and } from "drizzle-orm"
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
  try {
    console.log("=== EJECUTANDO getOrders ===");
    
    // Primero verificar la conexión a la base de datos
    const ordersCount = await db.select({ count: sql`count(*)` }).from(usersToProducts);
    console.log("Total de registros en usersToProducts:", ordersCount[0]?.count);

    // Obtener las órdenes con relaciones
    const orders = await db.query.usersToProducts.findMany({
      with: {
        user: true,
        product: true,
        variant: true, // También incluir la variante si existe
      },
      orderBy: (usersToProducts, { desc }) => [desc(usersToProducts.purchasedAt)], // Ordenar por fecha más reciente
    });

    console.log("Órdenes encontradas:", orders.length);
    
    // Verificar la estructura de las primeras órdenes
    if (orders.length > 0) {
      console.log("Estructura de la primera orden:");
      console.log("- ID:", orders[0].id);
      console.log("- Product ID:", orders[0].productId);
      console.log("- User ID:", orders[0].userId);
      console.log("- Payment ID:", orders[0].paymentId);
      console.log("- Tiene producto:", !!orders[0].product);
      console.log("- Tiene usuario:", !!orders[0].user);
      console.log("- Tiene variante:", !!orders[0].variant);
    }

    return orders;
  } catch (error) {
    console.error("❌ Error en getOrders:", error);
    throw new Error(`Error obteniendo órdenes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

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

export const buy = async (
  items: Items[],
  { 
    email, 
    delivery, 
    variants = [],
    paymentId // **NUEVO PARÁMETRO**
  }: { 
    email: string; 
    delivery: boolean;
    variants?: Array<{
      productId: number;
      variantId: number;
      quantity: number;
    }>;
    paymentId?: string; // **NUEVO PARÁMETRO OPCIONAL**
  },
) => {
  console.log("=== FUNCIÓN BUY INICIADA ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("Email:", email)
  console.log("Delivery:", delivery)
  console.log("Payment ID:", paymentId)
  console.log("Items recibidos:", JSON.stringify(items, null, 2))
  console.log("Variants recibidas:", JSON.stringify(variants, null, 2))

  try {
    // **VERIFICAR SI YA EXISTE UNA ORDEN CON ESTE PAYMENT ID**
    if (paymentId) {
      console.log(`🔍 Verificando si ya existe orden con paymentId: ${paymentId}`)
      const existingOrder = await db
        .select()
        .from(usersToProducts)
        .where(eq(usersToProducts.paymentId, paymentId))
        .limit(1)

      if (existingOrder.length > 0) {
        console.log(`🔄 Ya existe una orden con paymentId ${paymentId}, evitando duplicado`)
        return [] // Retornar array vacío para indicar que no se crearon nuevas órdenes
      }
    }

    // Verificar/crear usuario
    console.log("👤 Verificando usuario...")
    let userId;
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (users.length === 0) {
      console.log("👤 Usuario no existe, creando nuevo...")
      const [{ id }] = await db
        .insert(usersTable)
        .values({ email, name: email.split('@')[0] })
        .returning();
      userId = id;
      console.log("✅ Usuario creado con ID:", userId)
    } else {
      userId = users[0].id;
      console.log("✅ Usuario existente con ID:", userId)
    }

    // Preparar órdenes para insertar
    console.log("📦 Preparando órdenes para insertar...")
    const ordersToInsert = items.map((item, index) => {
      const variant = variants.find(v => v.productId === parseInt(item.id))
      
      const orderData = {
        productId: parseInt(item.id),
        userId,
        quantity: item.quantity,
        delivery,
        variantId: variant?.variantId || null,
        status: "pending" as const,
        paymentId: paymentId || null // **INCLUIR PAYMENT ID**
      }
      
      console.log(`📦 Item ${index + 1}:`, orderData)
      return orderData
    })

    console.log("💾 Insertando órdenes en base de datos...")
    console.log("Datos a insertar:", JSON.stringify(ordersToInsert, null, 2))

    const insertedOrders = await db.insert(usersToProducts).values(ordersToInsert).returning()
    
    console.log("✅ ÓRDENES INSERTADAS EXITOSAMENTE")
    console.log("Cantidad de órdenes insertadas:", insertedOrders.length)
    console.log("IDs de órdenes insertadas:", insertedOrders.map(o => o.id))
    
    // Revalidar rutas
    console.log("🔄 Revalidando rutas...")
    revalidatePath("/admin/orders")
    revalidatePath("/")
    
    return insertedOrders
  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN FUNCIÓN BUY:")
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error')
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace')
    throw error
  }
};

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

// Función de diagnóstico para verificar la estructura de la base de datos
export const diagnoseDatabase = async () => {
  try {
    console.log("=== DIAGNÓSTICO DE BASE DE DATOS ===");
    
    // Verificar usuarios
    const users = await db.select().from(usersTable).limit(5);
    console.log("Usuarios en la base de datos:", users.length);
    
    // Verificar productos
    const products = await db.select().from(productsTable).limit(5);
    console.log("Productos en la base de datos:", products.length);
    
    // Verificar órdenes
    const orders = await db.select().from(usersToProducts).limit(5);
    console.log("Órdenes en la base de datos:", orders.length);
    
    // Verificar variantes
    const variants = await db.select().from(productVariantsTable).limit(5);
    console.log("Variantes en la base de datos:", variants.length);
    
    // Verificar relaciones
    if (orders.length > 0) {
      const orderWithRelations = await db.query.usersToProducts.findFirst({
        with: {
          user: true,
          product: true,
          variant: true,
        },
      });
      
      console.log("Orden con relaciones:", {
        hasUser: !!orderWithRelations?.user,
        hasProduct: !!orderWithRelations?.product,
        hasVariant: !!orderWithRelations?.variant,
      });
    }
    
    return {
      users: users.length,
      products: products.length,
      orders: orders.length,
      variants: variants.length,
    };
  } catch (error) {
    console.error("❌ Error en diagnóstico:", error);
    throw error;
  }
};
