'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/providers/cart-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <CartProvider>
          {children}
          <Toaster/>
        </CartProvider>
    </SessionProvider>
  );
}
