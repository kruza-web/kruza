import Link from "next/link";
import { Nav } from "@/components/nav";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "@/components/user";
import { getUser } from "@/_actions/actions";
import { MobileDrawer } from "@/components/mobile-drawer";
import { Cart } from "@/components/cart-button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const email = await user?.email
  return (
    <>
      <header className="sticky top-0 z-50 ">
        <div className="flex items-center gap-10 justify-end border-b py-4 md:justify-between mx-4">
          <Link href={"/"} className="ml-4 hidden md:block">
            K3Y-SHOP
          </Link>
            <Nav />
          <div className="flex items-center space-x-3">
            <ModeToggle />
            <User />
             {user && <Cart  email={email} />} 
            <MobileDrawer />
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex flex-col items-center justify-center border-t py-2">
        <div className="flex py-4 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
        <Instagram className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        <Facebook className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        <Twitter className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </div>
        </div>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <p>© 2023 K3Y-SHOP. Todos los derechos reservados.</p>
        </div>  
        </footer>
    </>
  );
}
