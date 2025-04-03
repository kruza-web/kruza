"use server";

import { v2 as cloudinary } from "cloudinary";
import z from "zod";
import {
  adminsTable,
  editProductSchema,
  productSchema,
  productsTable,
} from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
  const { price, size, ...rest } = productSchema.parse(Object.fromEntries(formData));
  const { img, isRecommended, ...data } = {
    price: Number(price),
    ...rest,
  };

  const sizes = formData.getAll("size") as string[];
  const file = img as File;

  let publicId = "";

  if (file.size) {
    const { signature, timestamp } = getSignature();
    const data = await uploadFile({ file, signature, timestamp });
    publicId = data.public_id;
  }

  await db.insert(productsTable).values({
    img: publicId,
    isRecommended: !!isRecommended,
    size: sizes.join(", "),
    ...data,
  });
  revalidatePath("/");
};

export const deleteProduct = async (formData: FormData) => {
  const { id, img } = z
    .object({
      id: z.string(),
      img: z.string(),
    })
    .parse(Object.fromEntries(formData));

  await Promise.all([
    db.delete(productsTable).where(eq(productsTable.id, parseInt(id))),
    cloudinary.uploader.destroy(img),
  ]);
  revalidatePath("/");
};

export const editProduct = async (formData: FormData) => {
  const {
    title,
    id,
    publicId,
    description,
    img: file,
    price,
    isRecommended,
  } = editProductSchema.parse(Object.fromEntries(formData));

  const size = formData.getAll("size") as string[];

  let newPublicId = publicId;

  if (file?.size) {
    cloudinary.uploader.destroy(publicId);
    const { signature, timestamp } = getSignature();
    const { public_id } = await uploadFile({ file, signature, timestamp });
    newPublicId = public_id;
  }

  await db
    .update(productsTable)
    .set({
      title,
      description,
      isRecommended: !!isRecommended,
      img: newPublicId,
      price: Number(price),
      size: size.join(", "),
    })
    .where(eq(productsTable.id, parseInt(id)));

  revalidatePath("/admin/products");
};
