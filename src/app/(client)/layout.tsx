import { getUser } from "@/_actions/actions";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { ClientHeader } from "@/components/clientHeader";
import { getProducts } from "@/_actions/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

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
      <main className="flex-grow overflow-x-hidden">{children}</main>
      <footer className="bg-black/5">
        <div className="container mx-auto px-6 py-8">
           <div className="space-y-4 text-center justify-center mb-8 lg:mb-8">
              <Link href="/" className="text-3xl font-medium font-serif tracking-wider">
                KRUZA
              </Link>
              
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">


            {/* Columna 2: Legal */}
            <div className="space-y-4 mb-4 lg:mb-0">
              <h4 className="font-semibold uppercase ">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/legal" className="hover:text-gray-500 transition-colors">
                    Términos y Políticas
                  </Link>
                </li>
                <li><p className="text-sm">© 2025 KRUZA. Todos los derechos reservados.</p></li>
              </ul>
            </div>

            {/* Columna 3: Contacto y Redes Sociales */}
            <div className="space-y-4 mb-4 lg:mb-0">
              <h4 className="font-semibold uppercase">Contacto</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-gray-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contactar por WhatsApp</span>
                </a>
                <p>somoskruza@gmail.com</p>
                
              </div>
            </div>

            <div className="space-y-4 mb-4 lg:mb-0">
              <h4 className="font-semibold uppercase ">REDES</h4>
              <div className="space-y-2 text-sm"></div>
              <div className="flex items-center justify-center gap-4 pt-2">
                  <a href="#" aria-label="Instagram" className=" hover:text-gray-500 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" aria-label="Facebook" className=" hover:text-gray-500 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" aria-label="Twitter" className=" hover:text-gray-500 transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
                
            </div>

          </div>
          
        </div>
        
      </footer>
    </>
  );
}
