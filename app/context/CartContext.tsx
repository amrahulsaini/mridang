'use client'

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

// Cart Item interface
export interface CartItem {
  id: string  // Changed to string to use pro_id
  seller_sku_id?: string  // Added for seller SKU ID
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

// Cart State interface
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: Omit<CartItem, 'quantity'>; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

// Cart Context interface
interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isItemInCart: (id: string) => boolean
}

// Storage key and expiration
const CART_STORAGE_KEY = 'mridang_cart'
const CART_EXPIRATION_DAYS = 30

// Helper functions for localStorage
const saveCartToStorage = (cart: CartState) => {
  try {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + CART_EXPIRATION_DAYS)

    const cartData = {
      ...cart,
      expiration: expirationDate.toISOString()
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

const loadCartFromStorage = (): CartState | null => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    if (!cartData) return null

    const parsed = JSON.parse(cartData)

    // Check if cart has expired
    if (parsed.expiration) {
      const expirationDate = new Date(parsed.expiration)
      if (new Date() > expirationDate) {
        localStorage.removeItem(CART_STORAGE_KEY)
        return null
      }
    }

    // Remove expiration from the loaded data
    const { expiration, ...cart } = parsed
    // Check if cart has expired
    if (expiration && Date.now() > expiration) {
      return null
    }
    return cart
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return null
  }
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
}

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity = 1 } = action.payload
      const existingItem = state.items.find(stateItem => stateItem.id === item.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(stateItem =>
          stateItem.id === item.id
            ? { ...stateItem, quantity: stateItem.quantity + quantity }
            : stateItem
        )
      } else {
        newItems = [...state.items, { ...item, quantity }]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      const newState = {
        items: newItems,
        totalItems,
        totalPrice
      }

      saveCartToStorage(newState)
      return newState
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      const newState = {
        items: newItems,
        totalItems,
        totalPrice
      }

      saveCartToStorage(newState)
      return newState
    }

    case 'UPDATE_QUANTITY': {
      const newItems = action.payload.quantity === 0
        ? state.items.filter(item => item.id !== action.payload.id)
        : state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      const newState = {
        items: newItems,
        totalItems,
        totalPrice
      }

      saveCartToStorage(newState)
      return newState
    }

    case 'CLEAR_CART':
      saveCartToStorage(initialState)
      return initialState

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: savedCart })
    }
  }, [])

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const isItemInCart = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isItemInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}