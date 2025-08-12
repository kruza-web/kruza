"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-500/10"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Menu className="h-5 w-5 size-5" />
          <span className="sr-only">Categorías</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <DropdownMenuItem asChild>
          <Link href="/store?category=top" className="w-full cursor-pointer">
            Top
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/store?category=bottom" className="w-full cursor-pointer">
            Bottom
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/store?category=vestidos" className="w-full cursor-pointer">
            Vestidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/store" className="w-full cursor-pointer">
            Todas las categorías
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
