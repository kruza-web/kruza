"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useCart } from "../providers/cart-provider"
import { AlertCircle, CheckCircle, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SizeChartModal } from "@/components/size-chart-modal"
import type { SelectProduct, SelectColor, SelectProductVariant } from "@/db/schema"
import { currency } from "@/lib/utils"
import { CldImage } from "next-cloudinary"
import { useSession } from "next-auth/react"

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
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState<string>(product.img)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  // Calcular el precio con descuento
  const discount = product.discount || 0
  const discountedPrice = discount > 0 ? product.price - (product.price * discount) / 100 : product.price

  // Filtrar solo los colores que tiene este producto
  const productColorIds = [...new Set(variants.map((v) => v.colorId))]
  const productColors = colors.filter((color) => productColorIds.includes(color.id))

  // Verificar si hay variantes con stock disponible
  const hasStock = variants.some((v) => v.stock > 0)

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

  // Inicializar el primer color con stock si existe
  useEffect(() => {
    if (productColors.length > 0 && !selectedColor) {
      // Buscar el primer color que tenga stock
      const colorWithStock = productColors.find((color) => variants.some((v) => v.colorId === color.id && v.stock > 0))

      if (colorWithStock) {
        setSelectedColor(colorWithStock.id)
      } else if (productColors.length > 0) {
        // Si no hay colores con stock, seleccionar el primero de todos modos
        setSelectedColor(productColors[0].id)
      }
    }
  }, [productColors, variants, selectedColor])

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && currentStock > 0) {
      const variant = variants.find((v) => v.colorId === selectedColor && v.size === selectedSize)

      if (variant) {
        const colorName = colors.find((c) => c.id === selectedColor)?.name || ""

        addItem({
          id: product.id,
          title: `${product.title} - ${colorName} / ${selectedSize}`,
          price: discountedPrice, // Usar el precio con descuento
          img: product.img,
          size: selectedSize,
          color: selectedColor,
          variantId: variant.id,
          quantity: quantity,
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

  // Función para cambiar la imagen principal
  const changeMainImage = (imageUrl: string) => {
    setCurrentImage(imageUrl)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-24 items-start max-w-7xl px-4 mx-auto py-6">
      {/* Columna de imágenes (ahora a la izquierda) */}
      <div className="grid gap-3 items-start order-2 md:order-1">
        <div className="grid gap-4">
          <div className="relative">
            {!hasStock && (
              <div className="absolute bottom-0 right-0 left-0 bg-black bg-opacity-60 py-2 text-center z-10">
                <span className="text-white font-semibold">AGOTADO</span>
              </div>
            )}
            <CldImage
              src={currentImage}
              alt="Product image"
              width={600}
              height={600}
              className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
            />
          </div>
          <div className="flex gap-4 items-start justify-center">
            <button
              className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50"
              onClick={() => changeMainImage(product.img)}
            >
              <CldImage
                src={product.img}
                alt="Preview thumbnail"
                width={100}
                height={100}
                className={`aspect-square object-cover ${
                  currentImage === product.img ? "border-2 border-primary" : ""
                }`}
              />
              <span className="sr-only">View Image 1</span>
            </button>
            <button
              className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50"
              onClick={() => changeMainImage(product.img2)}
            >
              <CldImage
                src={product.img2}
                alt="Preview thumbnail"
                width={100}
                height={100}
                className={`aspect-square object-cover ${
                  currentImage === product.img2 ? "border-2 border-primary" : ""
                }`}
              />
              <span className="sr-only">View Image 2</span>
            </button>
            {product.img3 && (
              <button
                className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50"
                onClick={() => changeMainImage(product.img3)}
              >
                <CldImage
                  src={product.img3}
                  alt="Preview thumbnail"
                  width={100}
                  height={100}
                  className={`aspect-square object-cover ${
                    currentImage === product.img3 ? "border-2 border-primary" : ""
                  }`}
                />
                <span className="sr-only">View Image 3</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Columna de información (ahora a la derecha) */}
      <div className="grid gap-4 md:gap-10 items-start order-1 md:order-2">
        <div className="items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl">{product.title}</h1>
            <div className="flex items-center gap-4"></div>
            <div>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="text-4xl font-bold mt-4">
            {discount > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg text-gray-400 line-through">{currency.format(product.price)}</span>
                <span className="text-red-500">{currency.format(discountedPrice)}</span>
                <Badge className="mt-1 bg-red-500 w-fit">{discount}% OFF</Badge>
              </div>
            ) : (
              currency.format(product.price)
            )}
          </div>
        </div>
        <form className="grid gap-4 md:gap-6">
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-base">
              Color
            </Label>
            <RadioGroup
              id="color"
              value={selectedColor?.toString() || ""}
              onValueChange={(value) => setSelectedColor(Number.parseInt(value))}
              className="flex flex-wrap items-center gap-2"
              disabled={!hasStock}
            >
              {productColors.map((color) => {
                // Verificar si hay stock para este color
                const hasColorStock = variants.some((v) => v.colorId === color.id && v.stock > 0)

                return (
                  <Label
                    key={color.id}
                    htmlFor={`color-${color.id}`}
                    className={`border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800 ${
                      !hasColorStock ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <RadioGroupItem id={`color-${color.id}`} value={color.id.toString()} disabled={!hasColorStock} />
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hexCode }}></div>
                      {color.name}
                    </div>
                  </Label>
                )
              })}
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

          {!hasStock && (
            <div className="flex items-center text-red-600 mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Producto agotado en todos los colores y talles</span>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-base">
              Cantidad
            </Label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(Number.parseInt(value))}
              disabled={currentStock === 0}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(currentStock)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón de Tabla de Talles */}
          <div className="grid gap-2">
            <SizeChartModal />
          </div>

          {isAuthenticated ? (
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize || currentStock === 0}
              className="mt-4"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {!hasStock ? "Agotado" : "Agregar al carrito"}
            </Button>
          ) : (
            <Button type="button" disabled className="mt-4">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {"Debes iniciar sesión para agregar al carrito"}
            </Button>
          )}
        </form>
        <Separator />
        <div className="grid gap-4 text-sm leading-loose">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}
