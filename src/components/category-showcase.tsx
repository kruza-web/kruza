import Link from "next/link"

export function CategoryShowcase() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        {/* TOP Category */}
        <Link href="/store?category=top" className="group relative overflow-hidden">
          <div className="aspect-[4/5] relative bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src="/pic4.jpg"
              alt="Tops - Camisas y Blusas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute top-8 right-8 text-white text-right">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">TOP</h2>
              <p className="text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity">Ver Todo</p>
            </div>
          </div>
        </Link>

        {/* BOTTOM Category */}
        <Link href="/store?category=bottom" className="group relative overflow-hidden">
          <div className="aspect-[4/5] relative bg-gradient-to-br from-amber-100 to-amber-200">
            <img
              src="/pic6.jpg"
              alt="Bottoms - Pantalones y Faldas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute top-8 left-8 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">BOTTOM</h2>
              <p className="text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity">Ver Todo</p>
            </div>
          </div>
        </Link>

        {/* VESTIDOS Category */}
        <Link href="/store?category=vestidos" className="group relative overflow-hidden md:col-span-2">
          <div className="aspect-[4/5] md:aspect-[5/2.5] relative bg-gradient-to-br from-rose-100 to-rose-200">
            <img
              src="/pic5.jpg"
              alt="Vestidos - Elegancia y Estilo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">VESTIDOS</h2>
              <p className="text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity">Ver Todo</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
