import Link from "next/link";
import { Nav } from "@/components/nav";
import { User } from "@/components/user";
import { getUser } from "@/_actions/actions";
import { MobileDrawer } from "@/components/mobile-drawer";
import { Cart } from "@/components/cart-button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { FaqModal } from "@/components/faq-modal";
import { CategoryMenu } from "@/components/categoryMenu";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const email = await user?.email;
  return (
    <>
      <header className="fixed z-50 w-full text-2xl backdrop-blur transition-colors">
        <div className="flex items-center gap-10 justify-end py-4 md:justify-between mx-4">
          <div className="flex items-center gap-4 lg:gap-18">
            <Link href={"/"} className="ml-4 hidden md:block">
              KRUZA
            </Link>
            <CategoryMenu />
          </div>
          <div className="flex items-center space-x-3">
            <Nav />
            <FaqModal />
            <User />
            {user && <Cart email={email} />}
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
          <p>© 2023 KRUZA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
