'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Info, Search, Menu, X, ShoppingCart, Package, ChevronDown, Grid3x3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { state } = useCart()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { name: 'Home', href: '/', icon: Home, key: 'home' },
    { name: 'About', href: '/about', icon: Info, key: 'about' },
    { name: 'Orders', href: '/orders', icon: Package, key: 'orders' },
  ]

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoriesOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="header">
      <div className="container">
  <div className="flex items-center justify-between h-16 gap-3" style={{paddingLeft:0}}>
          {/* Logo Section */}
          <Link href="/" className="logo-container" aria-label="Mridang Home">
            <div className="logo-image">
              <Image
                src="/logo.png"
                alt="Mridang Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="logo-text hidden-mobile">Mridang</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden-mobile flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.key}
                href={item.href}
                className="nav-link"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="nav-link flex items-center gap-2"
              >
                <Grid3x3 size={18} />
                <span>Categories</span>
                <ChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[250px] max-h-[400px] overflow-y-auto z-50">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${encodeURIComponent(category.name)}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors no-underline"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden-mobile search-container" aria-label="Search">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="search-input"
            />
          </form>

          {/* Cart Section */}
          <div className="flex items-center gap-3">
            {/* Desktop Cart Button */}
            <div className="hidden-mobile flex items-center gap-2">
              <Link
                href="/cart"
                className="btn btn-primary inline-flex relative flex-col items-center gap-1"
              >
                <ShoppingCart size={18} />
                {state.totalItems === 0 ? (
                  <span className="text-sm">Cart</span>
                ) : (
                  <span className="bg-red-600 text-white rounded-full text-xs px-2 py-1 font-bold min-w-[1.5rem] text-center">
                    {state.totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button - hidden on desktop */}
            <button
              className="visible-mobile p-3 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="visible-mobile py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="search-input"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="visible-mobile bg-white border-t border-gray-200 shadow-lg">
          <div className="container py-6">
            {/* Navigation Links */}
            <div className="space-y-4 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 py-3 px-4 rounded-lg no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-100 pt-4">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Categories
                </div>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${encodeURIComponent(category.name)}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 py-3 px-4 rounded-lg no-underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Grid3x3 size={18} />
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Button */}
            <div className="flex flex-col gap-3">
              <Link
                href="/cart"
                className="btn btn-primary w-full relative flex flex-col items-center gap-1"
              >
                <ShoppingCart size={18} />
                {state.totalItems === 0 ? (
                  <span className="text-sm">Cart</span>
                ) : (
                  <span className="bg-red-600 text-white rounded-full text-xs px-2 py-1 font-bold min-w-[1.5rem] text-center">
                    {state.totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>
  )
}

export default Header