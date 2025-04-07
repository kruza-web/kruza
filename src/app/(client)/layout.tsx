import Link from "next/link";
import { Nav } from "@/components/nav";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "@/components/user";
import { getUser } from "@/_actions/actions";
import { MobileDrawer } from "@/components/mobile-drawer";

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode,
  }>) {

    const user = await getUser();
    return (
      <>
        <header className="sticky top-0 z-50 ">
          <div className="flex items-center justify-end border-b py-4 md:justify-between">
            <Link href={"/"} className="ml-4 hidden md:block">
              K3Y-SHOP
            </Link>
            <Nav className="hidden md:block"/>
            <div className="flex items-center space-x-3">
                <ModeToggle/>
                <User/>
                {/* {user && <Cart>} */}
                <MobileDrawer/>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </>
    );
  }