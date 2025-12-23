"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductInfoModal from '../components/ProductInfoModal'
import { Product } from '../types'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const router = useRouter()

  const [inputValue, setInputValue] = useState(query)
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  useEffect(() => {
    setInputValue(query)
  }, [query])

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to search products')
        }

        setProducts(data.products || [])
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  const handleInfoClick = (product: Product) => {
    setSelectedProduct(product)
    setIsInfoModalOpen(true)
  }

  const handleModalClose = () => {
    setIsInfoModalOpen(false)
    setSelectedProduct(null)
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const next = inputValue.trim()
    if (!next) return
    router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <div className="container py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-6 no-underline"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search size={28} className="text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
          </div>

          <form onSubmit={submitSearch} className="search-container" aria-label="Search products">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="search-input"
            />
          </form>

          {query && (
            <p className="text-gray-600">
              Showing results for: <span className="font-semibold text-gray-800">&quot;{query}&quot;</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Searching products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* No Query */}
        {!query && !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg mb-2">Type something to search</p>
            <p className="text-gray-500">Use the search box above to find products</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && products.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg mb-2">No products found</p>
            <p className="text-gray-500 mb-4">
              Try searching with different keywords or browse our categories
            </p>
            <Link href="/" className="btn btn-primary inline-flex">
              Browse All Products
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                Found <span className="font-bold text-red-600">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onInfoClick={handleInfoClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />

      {/* Product Info Modal */}
      <ProductInfoModal 
        product={selectedProduct}
        isOpen={isInfoModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
