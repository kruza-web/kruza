import { getColors } from "@/_actions/stock-actions"
import { ColorForm } from "./color-form"
import { ColorList } from "./color-list"
import { Suspense } from "react"

const Colors = async () => {
  const colors = await getColors()

  return (
    <ul className="container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {colors.map((color) => (
        <li key={color.id} className="m-6">
          <ColorList {...color} />
        </li>
      ))}
    </ul>
  )
}

export default function ColorsPage() {
  return (
    <>
      <div className="flex flex-col items-center mt-20 p-4">
        <h1 className="text-2xl font-bold">Colores</h1>
        <p className="mt-4 text-lg">Administra los colores disponibles para tus productos.</p>
      </div>
      <ColorForm />
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Lista de Colores</h2>
        <Suspense fallback={<p>Cargando colores...</p>}>
          <Colors />
        </Suspense>
      </div>
    </>
  )
}
