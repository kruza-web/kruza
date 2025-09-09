import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { SignIn } from "@/components/sign-in"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({
    searchParams,
  }: Readonly<{
    searchParams: SearchParams;
  }>)  {
    const { redirect } = await searchParams;
    return (
        <>
      <div className="flex flex-col items-center text-center p-6 mt-32">
        <h1 className="text-4xl font-sans tracking-tight lg:text-5xl xl:text-6xl">
          Inicio de sesión
        </h1>
        <p className="mb-10 font-sans max-w-2xl scroll-m-20 text-lg font-light text-muted-foreground md:mb-16">
          Podes loguear con tu cuenta de google
        </p>
        <Card className="w-full max-w-md mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Inicio de sesión</CardTitle>
            <CardDescription>
              Aca tu email!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignIn
              redirect={`/${redirect ?? ""}`}
            />
          </CardContent>
        </Card>
      </div>
    </>
    )
}