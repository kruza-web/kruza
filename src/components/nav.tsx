import { cn } from "@/lib/utils";
import SearchBar  from "./searchBar";
import { HTMLAttributes } from "react";
import {FC } from "react";
import { getProducts } from "@/_actions/actions";

type NavbarProps = HTMLAttributes<HTMLElement> 

export const Nav: FC<NavbarProps> = async ({
  className,
}: NavbarProps) => {
  const products = await getProducts()

  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      <div>
        <SearchBar products={products}/>
      </div>
    </nav>
  );
}