import { Button } from "@/components/ui/button";
import { adminLinks } from "./links";
import { redirect } from "next/navigation";
import { isAdmin } from "@/_actions/actions";
import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import Link from 'next/link';

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/sign-in?redirect=admin`);

  const email = session?.user?.email;
  if (!email) redirect(`/sign-in?redirect=admin`);

  const isAuthorized = await isAdmin(email);
  if (!isAuthorized) redirect(`/sign-in?redirect=admin`);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mt-20 md:mt-24">Admin</h1>
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-lg text-center px-4">Administra tu tienda desde aquí.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {adminLinks.map(({ path, title }) => (
            <li key={path} className="w-full">
              <Button 
                className="w-full" 
                variant="outline" 
                size="lg"
                asChild
              >
                <Link href={`/admin${path}`}>{title}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
