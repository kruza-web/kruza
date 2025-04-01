"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps, FC } from "react";
import { adminLinks } from "./links";

export const Nav: FC<ComponentProps<"nav">> = (props) => {
  const pathname = usePathname();
  return (
    <nav {...props} className="hidden md:block">
      <ul className="flex items-center gap-6">
        {adminLinks.map(({ path, title }) => (
          <li key={path}>
            <Link
              className={cn(
                "transition-colors hover:text-foreground",
                pathname.endsWith(path)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              href={`/es/admin${path}`}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
