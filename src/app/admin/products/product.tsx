"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { currency } from "@/lib/utils";
import { SelectProduct } from "@/db/schema";
import { DeleteProduct } from "./delete-product";
import { EditProduct } from "./edit-product";

export const Product = ({
  id,
  description,
  img,
  price,
  title,
  size,
  isRecommended,
}: SelectProduct) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden" key={id}>
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center">
        <CldImage
          key={id}
          alt={title}
          className="object-contain"
          src={img}
          fill
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p>{currency.format(price)}</p>
        <p className="text-sm ">{size}</p>
      </CardHeader>
      <CardContent>
        {isRecommended ? <div className="mb-2">Recomendado </div> : <div className="mb-2">No Recomendado </div> }
        <div className="items flex justify-end space-x-4">
          <EditProduct
            id={id}
            title={title}
            description={description}
            price={price}
            img={img}
            size={size}
            isRecommended={isRecommended}
          />
          <DeleteProduct id={id} img={img} />
        </div>
      </CardContent>
    </Card>
  );
};
