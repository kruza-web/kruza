"use client";

import { cn } from "@/lib/utils";
import SearchBar from "./searchBar";
import type { HTMLAttributes } from "react";
import type { FC } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  img: string;
  size: string;
};

type NavbarProps = HTMLAttributes<HTMLElement> & {
  products: Product[];
};

export const ClientNav: FC<NavbarProps> = ({
  className,
  products,
}: NavbarProps) => {
  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      <div>
        <SearchBar products={products} />
      </div>
    </nav>
  );
};
