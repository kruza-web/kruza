"use client";

import React from "react";
import { CldImage as NextCldImage, type CldImageProps } from "next-cloudinary";
import { cn } from "@/lib/utils";

export const CldImage = ({ className, ...props }: CldImageProps) => {
  return (
    <NextCldImage
      className={cn("object-cover object-center", className)}
      {...props}
    />
  );
};