import { isAdmin } from "@/_actions/actions";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Nav } from "./nav";
import { MobileDrawer } from "@/components/mobile-drawer";
import { ModeToggle } from "@/components/mode-toggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* const session = await auth(); */
  /* const email = session?.user?.email;
    if (!email) redirect(`/sign-in?redirect=admin`); */

  /* const isAuthorized = await isAdmin(email);
    if (!isAuthorized) redirect(`/sign-in?redirect=admin`); */

  return (
    <>
      <header className="container sticky top-0 z-50 mb-6 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:mb-8 md:mb-12">
        <div className="flex items-center justify-between border-b py-4">
          <h1>K3Y</h1>

          <Nav />
          <div className="flex items-center space-x-3">
            <ModeToggle />
            <MobileDrawer />
          </div>
        </div>
      </header>
      <main className="container grow">{children}</main>
    </>
  );
}
