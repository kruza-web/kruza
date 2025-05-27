"use client"

import { getProducts } from "@/_actions/actions"
import { getAllProductsStockStatus } from "@/_actions/stock-actions"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import type { StockStatus } from "@/lib/check-stock"

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
const ALL_SIZES = ["XS", "S", "M", "L", "XL"]

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Obtener todos los productos
        const fetchedProducts = await getProducts()

        // Obtener el estado de stock de todos los productos
        const stockStatus = await getAllProductsStockStatus()

        // Crear un mapa para acceder rápidamente al estado de stock por ID de producto
        const stockMap = new Map<number, StockStatus>()
        stockStatus.forEach((status) => {
          stockMap.set(status.productId, status)
        })

        // Combinar los productos con su información de stock
        const productsWithStockInfo = fetchedProducts.map((product) => {
          const stock = stockMap.get(product.id)
          return {
            ...product,
            soldOut: stock ? stock.soldOut : true, // Si no hay información de stock, asumir agotado
            discount: product.discount ?? 0,
          }
        })

        setProducts(productsWithStockInfo)
        setFilteredProducts(productsWithStockInfo)
      } catch (error) {
        console.error("Error fetching products:", error)
        // En caso de error, mostrar los productos sin información de stock
        const fetchedProducts = await getProducts()
        const productsWithoutStock = fetchedProducts.map((product) => ({
          ...product,
          soldOut: false, // Asumir que hay stock para evitar mostrar todo como agotado
          discount: product.discount ?? 0,
        }))
        setProducts(productsWithoutStock)
        setFilteredProducts(productsWithoutStock)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...products]

    // Apply size filter
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        if (!product.size) return false
        const productSizes = product.size.split(",").map((s) => s.trim())
        // Check if any of the product's sizes match any of the selected sizes
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
    <div className="container mx-auto mt-16 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Tienda</h1>

      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        {/* Size filter checkboxes */}
        <div className="md:w-1/2">
          <div className="mb-2 font-medium">Talles:</div>
          <div className="flex flex-wrap gap-2">
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

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
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
