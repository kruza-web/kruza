import Link from "next/link"

export function CategoryShowcase() {
  return (
    <div className="w-full max-w-screen py-8 mx-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SASTRERIA - TOP Category */}
        <Link href="/store?category=top" className="group relative overflow-hidden">
          <div className="aspect-[4/5] relative bg-gradient-to-br from-amber-100 to-amber-200">
            {/* Placeholder image - replace with actual category image */}
            <img
              src="/pic6.jpg"
              alt="Sastrería - Tops"
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

        {/* ABRIGOS - BOTTOM Category */}
        <Link href="/store?category=bottom" className="group relative overflow-hidden">
          <div className="aspect-[4/5] relative bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Placeholder image - replace with actual category image */}
            <img
              src="/pic4.jpg"
              alt="Abrigos - Bottoms"
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
      </div>
    </div>
  )
}
