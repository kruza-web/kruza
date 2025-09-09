import Link from "next/link"
import { Button } from "@/components/ui/button"
import {Instagram} from "lucide-react";

interface PromoBannerProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

export function PromoBanner({
  title = "Seguinos en Instagram",
  subtitle = "",
  buttonText = "",
  buttonLink = "https://www.instagram.com/kruza____",
}: PromoBannerProps) {
  return (
    <div className="w-full bg-black text-white py-4 lg:mb-10">
      <div className="container mx-auto px-4 flex items-center justify-center gap-6">
        <div className="text-center">
          <span className="text-xl font-bold">{title}</span>
          <span className="text-sm ml-5 opacity-90"> -{subtitle}</span>
        </div>
        <Link href={buttonLink}>
          <Button
            variant="outline"
            className="bg-transparent text-white hover:bg-white hover:text-black px-10 py-4 rounded-full"
          >
            <Instagram className="h-8 w-8" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
