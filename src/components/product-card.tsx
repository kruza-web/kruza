"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "../providers/cart-provider";
import { Minus, Plus } from "lucide-react";
import { currency } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string | null;
  img: string;
  img2: string;
  size: string;
  price: number;
  isRecommended: boolean;
  quantity?: number;
};

export function ProductCard({ products }: { products: Product }) {
  const [hovered, setHovered] = useState(false);
  const {title, price, img, img2 } = products;

  return (
    <>
      <div
        className="relative w-full h-[450px] overflow-hidden rounded-t-lg cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CldImage
          src={hovered ? img : img2}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        </div>
        <div>     
      <h2 className="pt-4 text-md text-gray-500 text-center">{title}</h2>
      <p className="pt-2 text-sm text-gray-500 text-center">
        {currency.format(price)}
      </p>
      </div>
    </>
  );
}
