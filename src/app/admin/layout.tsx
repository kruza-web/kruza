import { Nav } from "./nav";
import { MobileDrawer } from "@/app/admin/mobile-drawer";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";
import { isAdmin } from "@/_actions/actions";
import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

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
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/sign-in?redirect=admin`);

  const email = session?.user?.email;
  if (!email) redirect(`/sign-in?redirect=admin`);

  const isAuthorized = await isAdmin(email);
  if (!isAuthorized) redirect(`/sign-in?redirect=admin`);

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-background ">
        <div className="flex items-center gap-10 justify-end border-b py-4 md:justify-between mx-4">
          <h1>
            <Link href={"/admin"}>K3Y</Link>
          </h1>
          <Nav/>
          <div className="flex items-center space-x-3">
            <MobileDrawer />
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </>
  );
}
