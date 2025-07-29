import { RefreshCw, CreditCard, Phone, Mail } from "lucide-react"

export function InfoBanner() {
  const features = [
    {
      icon: RefreshCw,
      title: "CAMBIOS Y DEVOLUCIONES",
      description: "Tenes 30 días para cambiar tu pedido",
    },
    {
      icon: CreditCard,
      title: "MEDIOS DE PAGO",
      description: "6 cuotas sin interés a partir de $250.000",
    },
    {
      icon: Phone,
      title: "ASESORAMIENTO PERSONALIZADO",
      description: "Lunes a viernes de 9 a 17 hs",
    },
    {
      icon: Mail,
      title: "CONTACTANOS POR MAIL",
      description: "somoskruza@gmail.com",
    },
  ]

  return (
    <div className="w-full bg-gray-50 py-12 lg:mt-8 lg:mb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm tracking-wide">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
