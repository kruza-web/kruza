"use client"
import Link from "next/link"
import { Cart } from "@/components/cart-button"
import { ClientUser } from "@/components/user"
import { MobileDrawer } from "@/components/mobile-drawer"
import { ClientNav } from "@/components/nav"
import { FaqModal } from "@/components/faq-modal"
import { CategoryMenu } from "@/components/categoryMenu"
import { useState, useEffect } from "react"
import type { Session } from "next-auth"

type Product = {
  id: number
  title: string
  price: number
  img: string
  size: string
}

interface ClientHeaderProps {
  user: any
  email: string | undefined
  products: Product[]
  session: Session | null
  sessionName: string | null | undefined
  sessionEmail: string | null | undefined
  userId: number | undefined
}

export function ClientHeader({ user, email, products, session, sessionName, sessionEmail, userId }: ClientHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed z-50 w-full max-w-screen transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/40"
      }`}
    >
      {/* BANNER SUPERIOR */}
      {/* <div className="w-full max-w-screen bg-black text-white text-center py-2 text-sm font-medium">
        6 CUOTAS SIN INTERÉS A PARTIR DE $250.000
      </div> */}
      <div className="flex items-center justify-between px-4 py-6 max-w-none">
        <div className="flex lg:hidden items-center justify-between w-full">
          {/* Left side: Drawer and (on tablet) the logo */}
          <div className="flex items-center gap-4">
            <MobileDrawer products={products} />
            {/* Logo for Tablet */}
            <Link href="/" className="hidden md:block text-xl font-medium font-serif tracking-wider">
              KRUZA
            </Link>
          </div>

          {/* Center - Brand (Mobile only) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
            <Link href="/" className="text-xl font-medium font-serif tracking-wider">
              KRUZA
            </Link>
          </div>

          {/* Right - User and Cart */}
          <div className="flex items-center space-x-2">
            <ClientUser session={session} sessionName={sessionName} sessionEmail={sessionEmail} userId={userId} />
            {user && <Cart email={email} />}
          </div>
        </div>

        {/* Desktop Layout */}
         <div className="hidden lg:flex items-center justify-between w-full px-4">
          {/* Left side */}
          <div className="flex-1 flex justify-start">
            <CategoryMenu />
          </div>

          {/* Center - Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-medium font-serif tracking-wider">
              KRUZA
            </Link>
          </div>

          {/* Right side - Controls */}
          <div className="flex-1 flex justify-end items-center space-x-3">
            <ClientNav products={products} />
            <FaqModal />
            <ClientUser session={session} sessionName={sessionName} sessionEmail={sessionEmail} userId={userId} />
            {user && <Cart email={email} />}
          </div>
        </div>
      </div>
    </header>
  )
}
