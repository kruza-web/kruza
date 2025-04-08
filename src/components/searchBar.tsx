"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SearchResults from "../components/search-results"

// Datos de ejemplo para simular resultados de búsqueda
type Product = {
    id: number,
    title: string,
    price: number,
    img: string,
    size: string,
}

export default function SearchBar({products}: {products: Product[]}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      const filtered = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
      setFilteredProducts(filtered)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true)
    }
  }

  return (
    <div className="relative">
      <div className="sm:w-5 lg:w-3xl flex items-center border rounded-full overflow-hidden">
        <Input
          type="text"
          placeholder="Busca tu producto..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleFocus}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="icon" variant="ghost" className="rounded-full">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          <SearchResults products={filteredProducts} />
        </div>
      )}
    </div>
  )
}

