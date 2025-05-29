import { getUsers } from "@/_actions/actions";
import { UsersTable } from "./table";

export default async function Page() {
    const data = await getUsers()

    return (
        <>
        <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="mt-4 text-lg">Administra tus usuarios acá.</p>
        </div>

        <div>
            <div className="container mx-auto py-10">
            <UsersTable data={data} />
            </div>
        </div>
        </>
    );
}