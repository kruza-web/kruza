"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SearchBar from "./searchBar"
import { FaqModal } from "./faq-modal"
import { Separator } from "@/components/ui/separator"

type Product = {
  id: number
  title: string
  price: number
  img: string
  size: string
}

interface MobileDrawerProps {
  products: Product[]
}

export const MobileDrawer = ({ products }: MobileDrawerProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-500/10">
          <span className="sr-only">Menú</span>
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center">KRUZA</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 space-y-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Buscar productos</h3>
              <SearchBar products={products} />
            </div>

            <Separator />

            {/* Navegación */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Navegación</h3>
              <ul className="grid gap-3">
                <li>
                  <Link
                    href="/store"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store?category=top"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Tops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store?category=bottom"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Bottoms
                  </Link>
                </li>
              </ul>
            </div>

            <Separator />

            {/* FAQ */}
            <div className="space-y-2">
              <div className="flex justify-start">
                <FaqModal />
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
