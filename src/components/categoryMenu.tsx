"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { useState } from "react"

export function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger 
        className="flex items-center gap-1 text-lg transition-colors hover:text-foreground outline-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Categorías
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 absolute overflow-auto max-h-64"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
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
          <Link href="/store" className="w-full cursor-pointer">
            Todas las categorías
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}