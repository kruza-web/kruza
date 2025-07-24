import { getUser } from "@/_actions/actions";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { ClientHeader } from "@/components/clientHeader";
import { getProducts } from "@/_actions/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const email = await user?.email;
  const products = await getProducts();
  // Obtener datos de sesión para el componente User
  const session = await getServerSession(authOptions);
  const sessionName = session?.user?.name;
  const sessionEmail = session?.user?.email;
  const userId = user?.id;

  return (
    <>
      <ClientHeader
        user={user}
        email={email}
        products={products}
        session={session}
        sessionName={sessionName}
        sessionEmail={sessionEmail}
        userId={userId}
      />
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
