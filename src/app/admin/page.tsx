import { Button } from "@/components/ui/button";
import { adminLinks } from "./links";
import { redirect } from "next/navigation";
import { isAdmin } from "@/_actions/actions";
import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/sign-in?redirect=admin`);

  const email = session?.user?.email;
  if (!email) redirect(`/sign-in?redirect=admin`);

  const isAuthorized = await isAdmin(email);
  if (!isAuthorized) redirect(`/sign-in?redirect=admin`);

  return (
    <>
      <h1 className="text-2xl font-bold text-center">Admin</h1>
      <div className="grid grid-cols-1 gap-4 p-4 justify-items-center">
        <p className="text-lg">Administra tu tienda desde aquí.</p>
        <ul className="flex items-center justify-center gap-4">
          {adminLinks.map(({ path, title }) => (
            <li key={path}>
              <Button className="m-2" variant="outline" size="lg">
                <a href={`/admin${path}`}>{title}</a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
