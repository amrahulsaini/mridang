'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ProductInfoModal from '../components/ProductInfoModal'
import { Product } from '../types'

const PAGE_SIZE = 20

export default function ShopClient() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/products', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || 'Failed to fetch products')
        }
        setAllProducts(data.products || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const visibleProducts = useMemo(
    () => allProducts.slice(0, Math.min(visibleCount, allProducts.length)),
    [allProducts, visibleCount]
  )

  const canLoadMore = visibleCount < allProducts.length

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (!canLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, allProducts.length))
        }
      },
      { root: null, rootMargin: '800px 0px', threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [allProducts.length, canLoadMore])

  const handleInfoClick = (product: Product) => {
    setSelectedProduct(product)
    setIsInfoModalOpen(true)
  }

  const handleModalClose = () => {
    setIsInfoModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="flex items-center justify-between gap-4" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
            Shop
          </h1>
          <p className="text-gray-600" style={{ maxWidth: 720 }}>
            Browse all products. Scroll to load more.
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-700" style={{ fontWeight: 600 }}>
          <ShoppingBag size={18} />
          <span>{allProducts.length} items</span>
        </div>
      </div>

      {loading && (
        <div className="bg-white" style={{ borderRadius: 12, padding: 18 }}>
          <p className="text-gray-600">Loading products…</p>
        </div>
      )}

      {error && (
        <div className="bg-white" style={{ borderRadius: 12, padding: 18, border: '1px solid rgba(220,38,38,0.25)' }}>
          <p className="text-red-500" style={{ fontWeight: 700, marginBottom: 6 }}>Couldn’t load products</p>
          <p className="text-gray-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ marginTop: 12 }}>
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} {...p} onInfoClick={handleInfoClick} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      <ProductInfoModal product={selectedProduct} isOpen={isInfoModalOpen} onClose={handleModalClose} />
    </main>
  )
}
