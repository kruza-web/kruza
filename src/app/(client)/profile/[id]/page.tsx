import { editUser, getUser, getUserOrders } from "@/_actions/actions";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Submit } from "@/components/submit";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const Orders = async ({ id }: { id: number }) => {
  const orders = await getUserOrders(id);

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div>
        <h3 className="mb-6 scroll-m-20 text-2xl text-center font-semibold tracking-tight">
            Mis Compras
        </h3>
        </div>
    <Table className="mb-8">
      <TableCaption className="sr-only">Una lista de tus compras.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Nombre</TableHead>
          <TableHead className="text-center">Pagado el</TableHead>
          <TableHead className="text-center">Estado delivery</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders && orders.length > 0 ? (orders.map(
          ({ 
           product: { title, id},
           purchasedAt,
           status
        }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">
                <Link href={`/store`}>{title}</Link>
              </TableCell>
              <TableCell>{purchasedAt}</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
          )
        )) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Aún no tienes compras registradas.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
};

export default async function Profile() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <h2 className="my-16 scroll-m-20 text-center text-4xl font-extrabold tracking-tight sm:mb-10 md:mb-12 lg:mt-24 lg:text-5xl">
        Perfil
      </h2>

      <form
        action={editUser}
        className="mb-6 p-6 grid gap-6 sm:mb-10 md:mb-16 lg:mb-12 lg:grid-cols-2 max-w-4xl mx-auto"
      >
        <div className="grid w-full sm:w-full  items-center gap-1">
          <Label htmlFor="name" className="mb-2">Nombre</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="dni" className="mb-2">DNI</Label>
          <Input id="dni" name="dni" defaultValue={user.dni ?? ""} />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="dni" className="mb-2">Telefono</Label>
          <Input id="phone" name="phone" defaultValue={user.phone ?? ""} />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="dni" className="mb-2">Email</Label>
          <Input id="email" name="email" defaultValue={user.email ?? ""} />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="dni" className="mb-2">Ciudad</Label>
          <Input id="city" name="city" defaultValue={user.city ?? ""} />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="postalCode" className="mb-2">Codigo Postal</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={user.postalCode ?? ""}
          />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="street" className="mb-2">Calle</Label>
          <Input id="street" name="street" defaultValue={user.street ?? ""} />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="streetNumber" className="mb-2">Numero</Label>
          <Input
            id="streetNumber"
            name="streetNumber"
            type="number"
            defaultValue={user.streetNumber ?? ""}
          />
        </div>

        <div className="grid w-full sm:w-full items-center gap-1">
          <Label htmlFor="indications" className="mb-2">Indicaciones</Label>
          <Input
            id="indications"
            name="indications"
            type="text"
            placeholder="Describe como te podemos encontrar"
            defaultValue={user.indications ?? ""}
          />
        </div>
        <input type="hidden" name="id" value={user.id} />

        <div className="flex sm:col-span-2 justify-center">
          <Submit text="Guardar Cambios" className="w-full sm:w-auto" />
        </div>
      </form>

      <Orders id={user.id} />
    </>
  );
}
