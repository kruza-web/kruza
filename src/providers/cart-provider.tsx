"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: number
  title: string
  price: number
  img: string
  quantity: number
  size: string
  color?: number
  variantId?: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & {quantity?: number}) => void
  removeItem: (id: number, variantId?: number) => void
  updateQuantity: (id: number, quantity: number, variantId?: number) => void
  clearCart: () => void
  itemCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Calculate total number of items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

 // Add item to cart
  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    // Usar la cantidad proporcionada o 1 por defecto
    const quantityToAdd = newItem.quantity || 1

    setItems((prevItems) => {
      // Si el producto tiene una variante, buscar por ID de producto y variante
      if (newItem.variantId) {
        const existingItem = prevItems.find((item) => item.id === newItem.id && item.variantId === newItem.variantId)

        if (existingItem) {
          // Si el item ya existe, aumentar la cantidad según la cantidad seleccionada
          return prevItems.map((item) =>
            item.id === newItem.id && item.variantId === newItem.variantId
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item,
          )
        } else {
          // Si no existe, agregar nuevo item con la cantidad seleccionada
          return [...prevItems, { ...newItem, quantity: quantityToAdd }]
        }
      } else {
        // Comportamiento anterior para productos sin variantes
        const existingItem = prevItems.find((item) => item.id === newItem.id)

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + quantityToAdd } : item,
          )
        } else {
          return [...prevItems, { ...newItem, quantity: quantityToAdd }]
        }
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: number, variantId?: number) => {
    setItems((prevItems) => {
      if (variantId) {
        const existingItem = prevItems.find((item) => item.id === id && item.variantId === variantId)

        if (existingItem && existingItem.quantity > 1) {
          // Si la cantidad > 1, disminuir cantidad
          return prevItems.map((item) =>
            item.id === id && item.variantId === variantId ? { ...item, quantity: item.quantity - 1 } : item,
          )
        } else {
          // Si no, eliminar el item completamente
          return prevItems.filter((item) => !(item.id === id && item.variantId === variantId))
        }
      } else {
        // Comportamiento anterior para productos sin variantes
        const existingItem = prevItems.find((item) => item.id === id)

        if (existingItem && existingItem.quantity > 1) {
          return prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        } else {
          return prevItems.filter((item) => item.id !== id)
        }
      }
    })
  }

  // Update quantity directly
  const updateQuantity = (id: number, quantity: number, variantId?: number) => {
    if (quantity <= 0) {
      if (variantId) {
        setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.variantId === variantId)))
      } else {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      }
    } else {
      if (variantId) {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id && item.variantId === variantId ? { ...item, quantity } : item)),
        )
      } else {
        setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
