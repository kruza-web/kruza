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
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      {/* BANNER SUPERIOR */}
      <div className="w-full max-w-screen bg-black text-white text-center py-2 text-sm font-medium">
        6 CUOTAS SIN INTERÉS A PARTIR DE $250.000
      </div>
      <div className="flex items-center justify-between px-4 py-4 max-w-none">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left - Mobile Drawer */}
          <div className="flex items-center">
            <MobileDrawer products={products} />
          </div>

          {/* Center - Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-xl font-bold tracking-wider">
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
        <div className="hidden md:flex items-center justify-between w-full px-2">
          {/* Left side - Categories */}
          <div className="flex items-center">
            <CategoryMenu />
          </div>

          {/* Center - Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold tracking-wider">
              KRUZA
            </Link>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-3">
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
