'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Info, Search, Menu, X, ShoppingCart, Package, ChevronDown, Grid3x3, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { AnimatePresence, motion } from 'framer-motion'

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  // Initialize states - ensure they're false on mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { state } = useCart()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { name: 'Home', href: '/', icon: Home, key: 'home' },
    { name: 'Shop', href: '/shop', icon: Store, key: 'shop' },
    { name: 'About', href: '/about', icon: Info, key: 'about' },
    { name: 'Orders', href: '/orders', icon: Package, key: 'orders' },
  ]

  // Ensure menus are closed on mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMenuOpen(false)
      setIsCategoriesOpen(false)
    }
  }, [])

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

  // Close dropdown on window resize (especially for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCategoriesOpen(false)
        // Also close mobile menu on page load if on mobile
        if (isMenuOpen) {
          setIsMenuOpen(false)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    // Check on mount and close menus on mobile
    if (window.innerWidth <= 768) {
      setIsCategoriesOpen(false)
      setIsMenuOpen(false)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Lock page scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prevOverflow = document.body.style.overflow
    const prevTouchAction = (document.body.style as unknown as { touchAction?: string }).touchAction || ''
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      ;(document.body.style as unknown as { touchAction?: string }).touchAction = 'none'
    }
    return () => {
      document.body.style.overflow = prevOverflow
      ;(document.body.style as unknown as { touchAction?: string }).touchAction = prevTouchAction
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsMobileCategoriesOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      closeMenu()
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      closeMenu()
    }
  }

  return (
    <header className="header">
      {/* Mobile sticky bar (logo + menu only) */}
      <div className="mobile-header-bar visible-mobile">
        <Link href="/" className="mobile-logo" aria-label="Mridang Home" onClick={closeMenu}>
          <span className="mobile-logo-image">
            <Image
              src="/logo.png"
              alt="Mridang Logo"
              fill
              className="object-contain"
              priority
            />
          </span>
        </Link>
        <button
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop header */}
      <div className="container hidden-mobile">
        <div className="header-content flex items-center justify-between gap-3">
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
            <h1 className="logo-text">Mridang</h1>
          </Link>

          <nav className="flex items-center gap-6 flex-wrap">
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
                <div className="categories-dropdown">
                  <div className="category-dropdown-header">
                    Browse Categories
                  </div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${encodeURIComponent(category.name)}`}
                      className="category-dropdown-item"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="search-container" aria-label="Search">
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="btn btn-primary inline-flex relative whitespace-nowrap"
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
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="mobile-drawer-backdrop" aria-label="Close menu" onClick={closeMenu} />

            <motion.aside
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-title">Menu</span>
                <button className="mobile-drawer-close" onClick={closeMenu} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-drawer-body">
                <form onSubmit={handleSearch} className="mobile-drawer-search" aria-label="Search">
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

                <nav className="mobile-drawer-nav" aria-label="Navigation">
                  {navItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="mobile-drawer-link"
                      onClick={closeMenu}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mobile-drawer-section">
                  <button
                    className="mobile-categories-toggle"
                    onClick={() => setIsMobileCategoriesOpen((v) => !v)}
                    type="button"
                  >
                    <span className="mobile-categories-toggle-left">
                      <Grid3x3 size={18} />
                      Categories
                    </span>
                    <motion.span
                      animate={{ rotate: isMobileCategoriesOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isMobileCategoriesOpen && (
                      <motion.div
                        className="mobile-categories-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mobile-categories-inner">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${encodeURIComponent(category.name)}`}
                              className="mobile-categories-link"
                              onClick={closeMenu}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mobile-drawer-footer">
                <Link href="/cart" className="mobile-cart-cta" onClick={closeMenu}>
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {state.totalItems > 0 && <span className="mobile-cart-count">{state.totalItems}</span>}
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}

export default Header