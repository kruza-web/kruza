import { v2 as cloudinary } from "cloudinary";
import z from "zod";
import {auth, signIn, signOut} from "../../auth"

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const uploadEndpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

const getSignature = () => {
    const timestamp = Math.round(Date.now() / 1000).toString();
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "k3y-shop" },
      cloudinaryConfig.api_secret!,
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
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    );
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("folder", folder);
  
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      body: cloudinaryFormData,
    });
  
    if (!response.ok) throw new Error("cloudinary fetch failed");
  
    const cldData = await response.json();
    const data = z
      .object({ secure_url: z.string(), public_id: z.string() })
      .parse(cldData);
  
    return data;
  };

  export const signInAction = async (formData: FormData) => {
    const redirectPath = formData.get("redirect");
    await signIn(
      "google",
      typeof redirectPath === "string" && redirectPath
        ? { redirectTo: redirectPath }
        : {},
    );
  };
  
  export const signOutAction = async () => {
    await signOut();
  };