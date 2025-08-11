"use client"

import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { useSearchParams } from "next/navigation"

// Define the product type based on your data structure
type Product = {
  id: number
  title: string
  description: string | null
  img: string
  img2: string
  size: string
  price: number
  discount?: number
  isRecommended: boolean
  category: string
  quantity?: number
  soldOut?: boolean
}

// Lista fija de todos los talles posibles
const ALL_SIZES = ["S", "M", "L", "Único"]

interface StoreClientProps {
  initialProducts: Product[]
  initialCategory?: string
}

export function StoreClient({ initialProducts, initialCategory }: StoreClientProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all")
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null)

    const searchParams = useSearchParams()

  // Escuchar cambios en los parámetros de URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all"
    setCategoryFilter(categoryFromUrl)
  }, [searchParams])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...products]

    // Apply size filter
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        if (!product.size) return false
        const productSizes = product.size.split(",").map((s) => s.trim())
        return productSizes.some((size) => selectedSizes.includes(size))
      })
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter)
    }

    // Apply price sorting - consider discounted prices
    if (priceSort === "asc") {
      result = result.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * (a.discount || 0)) / 100 : a.price
        const priceB = b.discount ? b.price - (b.price * (b.discount || 0)) / 100 : b.price
        return priceA - priceB
      })
    } else if (priceSort === "desc") {
      result = result.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * (a.discount || 0)) / 100 : a.price
        const priceB = b.discount ? b.price - (b.price * (b.discount || 0)) / 100 : b.price
        return priceB - priceA
      })
    }

    setFilteredProducts(result)
  }, [selectedSizes, categoryFilter, priceSort, products])

  // Toggle price sorting
  const togglePriceSort = () => {
    if (priceSort === null) {
      setPriceSort("desc")
    } else if (priceSort === "desc") {
      setPriceSort("asc")
    } else {
      setPriceSort(null)
    }
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  return (
    <div className="container mx-auto mt-38 px-12 py-8">
      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        {/* Size filter checkboxes */}
        <div className="md:w-1/2">
          <div className="flex flex-wrap gap-2 h-full items-center">
            {ALL_SIZES.map((size) => (
              <label
                key={size}
                className={`inline-flex items-center px-3 py-1 rounded-md border cursor-pointer text-sm
                  ${
                    selectedSizes.includes(size)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="sr-only"
                />
                {size}
              </label>
            ))}
            {selectedSizes.length > 0 && (
              <button
                onClick={() => setSelectedSizes([])}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Right side filters */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:justify-end">
          {/* Category filter */}
          <div className="w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price sort button */}
          <Button variant="outline" onClick={togglePriceSort} className="flex items-center gap-2 w-full md:w-auto">
            Precio
            {priceSort === "asc" ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : priceSort === "desc" ? (
              <ArrowDownAZ className="h-4 w-4" />
            ) : (
              <span className="text-xs text-muted-foreground">Sin ordenar</span>
            )}
          </Button>
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron productos con los filtros seleccionados.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 lg:gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/store/${product.id}`}>
              <li>
                <ProductCard products={{ ...product, quantity: 0 }} />
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}