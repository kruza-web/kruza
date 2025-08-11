"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { adminLinks } from "@/app/admin/links";

export const MobileDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="md:hidden">
        <Button variant="outline" size={"icon"}>
          <span className="sr-only">options</span>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center">K3Y-SHOP</DrawerTitle>
          </DrawerHeader>
          <ul className="grid justify-center gap-3 text-center">
            {adminLinks.map(({ path, title }) => (
              <li key={path}>
                <Link
                  href={`/admin${path}`}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
