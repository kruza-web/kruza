import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PromoBannerProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

export function PromoBanner({
  title = "",
  subtitle = "",
  buttonText = "",
  buttonLink = "",
}: PromoBannerProps) {
  return (
    <div className="w-full bg-black text-white py-4 lg:mb-10">
      <div className="container mx-auto px-4 flex items-center justify-center gap-6">
        <div className="text-center">
          <span className="text-lg font-bold">{title}</span>
          <span className="text-sm ml-2 opacity-90"> {subtitle}</span>
        </div>
        {/* <Link href={buttonLink}>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black px-6 py-2 rounded-full text-sm font-medium"
          >
            {buttonText}
          </Button>
        </Link> */}
      </div>
    </div>
  )
}
