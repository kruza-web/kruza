import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import {FC } from "react";

type NavbarProps = HTMLAttributes<HTMLElement> 

export const Nav: FC<NavbarProps> = ({
  className,
}: NavbarProps) => {
  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      <Link href="/" className="transition-colors hover:text-foreground text-muted-foreground">
        Tienda
      </Link>
    </nav>
  );
}