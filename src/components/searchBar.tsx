"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SearchResults from "../components/search-results"

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
      <div className="lg:min-w-[348px] flex items-center border-b-1 border-black overflow-hidden">
        <Input
          type="text"
          placeholder="Busca tu producto..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleFocus}
          className="border-0 p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-700"
        />
        <Button type="submit" size="icon" variant="ghost" className="rounded-full justify-end hover:bg-transparent">
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

