import { getOrders } from "@/_actions/actions";
import { DataTableDemo } from "./table";

export default async function DemoPage() {
  const data = (await getOrders()).map((order) => ({
    id: order.id,
    title: order.product.title,
    quantity: order.quantity,
    email: order.user.email,
    status: order.status,
    purchasedAt: order.purchasedAt,
    city: order.user.city,
    indications: order.user.indications,
    postalCode: order.user.postalCode,
    state: order.user.state,
    street: order.user.street,
    streetNumber: order.user.streetNumber,
    delivery: order.delivery,
    phone: order.user.phone,
  }));

  return (
    <>
    <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">Ordenes</h1>
        <p className="mt-4 text-lg">Administra tus ordenes acá.</p>
      </div>
    <div className="container mx-auto py-10">
      <DataTableDemo data={data} />
    </div>
    </>
  );
}
