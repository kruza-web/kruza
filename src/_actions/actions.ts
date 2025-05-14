"use server";

import { v2 as cloudinary } from "cloudinary";
import z from "zod";
import {
  adminsTable,
  editProductSchema,
  productSchema,
  productsTable,
  usersToProducts,
  usersTable,
  productVariantsTable
} from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SelectUserToProduct } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { Items } from "mercadopago/dist/clients/commonTypes";

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadEndpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

const getSignature = () => {
  const timestamp = Math.round(Date.now() / 1000).toString();
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "k3y-shop" },
    cloudinaryConfig.api_secret!
  );
  return { timestamp, signature };
};

const uploadFile = async ({
  file,
  signature,
  timestamp,
  folder = "k3y-shop",
}: {
  file: File;
  signature: string;
  timestamp: string;
  folder?: string;
}) => {
  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append(
    "api_key",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
  );
  cloudinaryFormData.append("signature", signature);
  cloudinaryFormData.append("timestamp", timestamp);
  cloudinaryFormData.append("folder", folder);

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: cloudinaryFormData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary error response:", errorText);
    throw new Error("cloudinary fetch failed");
  }

  const cldData = await response.json();
  const data = z
    .object({ secure_url: z.string(), public_id: z.string() })
    .parse(cldData);

  return data;
};

export const isAdmin = async (email: string) => {
  return (
    (await db.select().from(adminsTable).where(eq(adminsTable.email, email)))
      .length !== 0
  );
};

export const getProducts = async (
  options: Partial<{ recommended: boolean }> = { recommended: false }
) => {
  if (!options.recommended) return await db.select().from(productsTable);
  return await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isRecommended, options.recommended));
};

export const createProduct = async (formData: FormData) => {
  const file = formData.get("img") as File | null;
  const file2 = formData.get("img2") as File | null;
  const file3 = formData.get("img3") as File | null;

  const entries = Array.from(formData.entries()).filter(
    ([key]) => !["img", "img2", "img3"].includes(key)
  );
  const parsed = productSchema.parse(Object.fromEntries(entries));

  const { price, size, isRecommended, ...rest } = parsed;
  const sizes = formData.getAll("size") as string[];

  let publicId = "";
  let publicId2 = "";
  let publicId3 = "";

  if (file instanceof File && file.size > 0) {
    const { signature, timestamp } = getSignature();
    const data = await uploadFile({ file, signature, timestamp });
    publicId = data.public_id;
  }

  if (file2 instanceof File && file2.size > 0) {
    const { signature, timestamp } = getSignature();
    const data = await uploadFile({ file: file2, signature, timestamp });
    publicId2 = data.public_id;
  }

  if (file3 instanceof File && file3.size > 0) {
    const { signature, timestamp } = getSignature();
    const data = await uploadFile({ file: file3, signature, timestamp });
    publicId3 = data.public_id;
  }

  await db.insert(productsTable).values({
    ...rest,
    img: publicId,
    img2: publicId2,
    img3: publicId3,
    isRecommended: Boolean(isRecommended),
    size: sizes.join(", "),
    price: Number(price),
  });
  revalidatePath("/");
};

export const deleteProduct = async (formData: FormData) => {
  const { id, img, img2, img3 } = z
    .object({
      id: z.string(),
      img: z.string(),
      img2: z.string(),
      img3: z.string(),
    })
    .parse(Object.fromEntries(formData));

    // 1. Borra variantes relacionadas
  await db.delete(productVariantsTable).where(eq(productVariantsTable.productId, parseInt(id)));

  // 2. Borra otras relaciones si existen (ejemplo: usersToProducts)
  await db.delete(usersToProducts).where(eq(usersToProducts.productId, parseInt(id)));


  await Promise.all([
    db.delete(productsTable).where(eq(productsTable.id, parseInt(id))),
    cloudinary.uploader.destroy(img),
    cloudinary.uploader.destroy(img2),
    cloudinary.uploader.destroy(img3),
  ]);
  revalidatePath("/");
};

export const editProduct = async (formData: FormData) => {
  const file = formData.get("img") as File | null;
  const file2 = formData.get("img2") as File | null;
  const file3 = formData.get("img3") as File | null;

  const origPublicId = formData.get("publicId") as string;
  const origPublicId2 = formData.get("publicId2") as string;
  const origPublicId3 = formData.get("publicId3") as string;

  const entries = Array.from(formData.entries()).filter(
    ([key]) => !["img", "img2", "img3"].includes(key)
  );
  const parsed = editProductSchema.parse(Object.fromEntries(entries));

  const {
    title,
    id,
    description,
    price,
    isRecommended,
    category,
  } = parsed;

  const sizes = formData.getAll("size") as string[];

  let newPublicId = origPublicId;
  let newPublicId2 = origPublicId2;
  let newPublicId3 = origPublicId3;

  if (file instanceof File && file.size > 0 && origPublicId) {
    cloudinary.uploader.destroy(origPublicId);
    const { signature, timestamp } = getSignature();
    const { public_id } = await uploadFile({ file, signature, timestamp });
    newPublicId = public_id;
  }

  if (file2 instanceof File && file2.size > 0 && origPublicId2) {
    cloudinary.uploader.destroy(origPublicId2);
    const { signature, timestamp } = getSignature();
    const { public_id } = await uploadFile({
      file: file2,
      signature,
      timestamp,
    });
    newPublicId2 = public_id;
  }

  if (file3 instanceof File && file3.size > 0 && origPublicId3) {
    cloudinary.uploader.destroy(origPublicId3);
    const { signature, timestamp } = getSignature();
    const { public_id } = await uploadFile({
      file: file3,
      signature,
      timestamp,
    });
    newPublicId3 = public_id;
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
      price: Number(price),
      size: sizes.join(", "),
    })
    .where(eq(productsTable.id, parseInt(id)));

  revalidatePath("/admin/products");
};

export const changeStatus = async ({
  id,
  status,
}: {
  status: SelectUserToProduct["status"];
  id: SelectUserToProduct["id"];
}) => {
  await db
    .update(usersToProducts)
    .set({ status })
    .where(eq(usersToProducts.id, id));
  revalidatePath("/admin/orders");
};

export const getOrders = async () => {
  return await db.query.usersToProducts.findMany({
    with: {
      user: true,
      product: true,
    },
  });
};

export const getUsers = async () => {
  return await db.select().from(usersTable);
};

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return;

  return await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
};

export const buy = async (
  items: Items[],
  { email, delivery }: { email: string; delivery: boolean }
) => {
  let userId;
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (users.length === 0) {
    const [{ id }] = await db
      .insert(usersTable)
      .values({ email, name: "" })
      .returning();
    userId = id;
  } else {
    userId = users[0].id;
  }

  await db.insert(usersToProducts).values(
    items.map(({ id: productId, quantity }) => ({
      productId: parseInt(productId),
      userId,
      quantity,
      delivery,
    }))
  );

  revalidatePath("/");
};

export const getProductById = async (id: string) => {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, parseInt(id)),
  });
  if (!product) throw new Error("Product not found");
  return product;
}
