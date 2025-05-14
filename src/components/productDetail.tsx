"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useCart } from "../providers/cart-provider"
import { AlertCircle, CheckCircle, ShoppingCart } from "lucide-react"
import type { SelectProduct, SelectColor, SelectProductVariant } from "@/db/schema"
import { currency } from "@/lib/utils"
import { CldImage } from "next-cloudinary"

interface ProductDetailProps {
  product: SelectProduct
  colors: SelectColor[]
  variants: SelectProductVariant[]
}

export const ProductDetail = ({ product, colors, variants }: ProductDetailProps) => {
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [currentStock, setCurrentStock] = useState<number>(0)
  const [stockStatus, setStockStatus] = useState<"available" | "low" | "out">("out")

  // Cuando cambia el color seleccionado, actualizar los talles disponibles
  useEffect(() => {
    if (selectedColor) {
      const sizesForColor = variants.filter((v) => v.colorId === selectedColor && v.stock > 0).map((v) => v.size)

      setAvailableSizes(sizesForColor)
      setSelectedSize(null) // Resetear el talle seleccionado
      setCurrentStock(0)
      setStockStatus("out")
    }
  }, [selectedColor, variants])

  // Cuando cambia el talle seleccionado, actualizar el stock disponible
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = variants.find((v) => v.colorId === selectedColor && v.size === selectedSize)

      if (variant) {
        setCurrentStock(variant.stock)

        // Determinar el estado del stock
        if (variant.stock === 0) {
          setStockStatus("out")
        } else if (variant.stock <= 5) {
          setStockStatus("low")
        } else {
          setStockStatus("available")
        }
      }
    }
  }, [selectedColor, selectedSize, variants])

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && currentStock > 0) {
      const variant = variants.find((v) => v.colorId === selectedColor && v.size === selectedSize)

      if (variant) {
        const colorName = colors.find((c) => c.id === selectedColor)?.name || ""

        addItem({
          id: product.id,
          title: `${product.title} - ${colorName} / ${selectedSize}`,
          price: product.price,
          img: product.img,
          size: selectedSize,
          color: selectedColor,
          variantId: variant.id,
        })
      }
    }
  }

  const getStockMessage = () => {
    switch (stockStatus) {
      case "available":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>En stock ({currentStock} disponibles)</span>
          </div>
        )
      case "low":
        return (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>¡Últimas unidades! ({currentStock} disponibles)</span>
          </div>
        )
      case "out":
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>Agotado</span>
          </div>
        )
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="grid gap-4 md:gap-10 items-start">
        <div className="hidden md:flex items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl">{product.title}</h1>
            <div className="flex items-center gap-4"></div>
            <div>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="text-4xl font-bold ml-auto">{currency.format(product.price)}</div>
        </div>
        <form className="grid gap-4 md:gap-10">
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-base">
              Color
            </Label>
            <RadioGroup
              id="color"
              value={selectedColor?.toString() || ""}
              onValueChange={(value) => setSelectedColor(Number.parseInt(value))}
              className="flex flex-wrap items-center gap-2"
            >
              {colors.map((color) => (
                <Label
                  key={color.id}
                  htmlFor={`color-${color.id}`}
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                >
                  <RadioGroupItem id={`color-${color.id}`} value={color.id.toString()} />
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hexCode }}></div>
                    {color.name}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="size" className="text-base">
              Talle
            </Label>
            <RadioGroup
              id="size"
              value={selectedSize || ""}
              onValueChange={setSelectedSize}
              className="flex flex-wrap items-center gap-2"
              disabled={!selectedColor || availableSizes.length === 0}
            >
              {product.size.split(",").map((size) => {
                const sizeValue = size.trim()
                const isAvailable = availableSizes.includes(sizeValue)

                return (
                  <Label
                    key={sizeValue}
                    htmlFor={`size-${sizeValue}`}
                    className={`border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800 ${
                      !isAvailable && selectedColor ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <RadioGroupItem
                      id={`size-${sizeValue}`}
                      value={sizeValue}
                      disabled={!isAvailable && selectedColor !== null}
                    />
                    {sizeValue}
                  </Label>
                )
              })}
            </RadioGroup>
          </div>

          {selectedColor && selectedSize && <div className="mt-2">{getStockMessage()}</div>}

          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-base">
              Cantidad
            </Label>
            <Select defaultValue="1" disabled={currentStock === 0}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(Math.min(currentStock, 5))].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize || currentStock === 0}
            className="mt-4"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al carrito
          </Button>
        </form>
        <Separator />
        <div className="grid gap-4 text-sm leading-loose">
          <p>{product.description}</p>
        </div>
      </div>
      <div className="grid gap-3 items-start">
        <div className="flex md:hidden items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-2xl sm:text-3xl">{product.title}</h1>
            <div>
              <p>{product.description}</p>
            </div>
            <div className="flex items-center gap-4"></div>
          </div>
          <div className="text-4xl font-bold ml-auto">{currency.format(product.price)}</div>
        </div>
        <div className="grid gap-4">
          <CldImage
            src={product.img}
            alt="Product image"
            width={600}
            height={600}
            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
          />
          <div className="hidden md:flex gap-4 items-start">
            <button className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50">
              <CldImage
                src={product.img2}
                alt="Preview thumbnail"
                width={100}
                height={100}
                className="aspect-square object-cover"
              />
              <span className="sr-only">View Image 1</span>
            </button>
            {product.img3 && (
              <button className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50">
                <CldImage
                  src={product.img3}
                  alt="Preview thumbnail"
                  width={100}
                  height={100}
                  className="aspect-square object-cover"
                />
                <span className="sr-only">View Image 2</span>
              </button>
            )}
            <button className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50">
              <CldImage
                src={product.img}
                alt="Preview thumbnail"
                width={100}
                height={100}
                className="aspect-square object-cover"
              />
              <span className="sr-only">View Image 3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
