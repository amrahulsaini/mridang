'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Package, Grid3x3, Home } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/app/components/ProductCard'
import ProductInfoModal from '@/app/components/ProductInfoModal'
import { Product } from '@/app/types'
import styles from '../Category.module.css'

interface CategoryContentProps {
  categoryName: string
}

export default function CategoryContent({ categoryName }: CategoryContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch products')
        }

        setProducts(data.products || [])
      } catch (err) {
        console.error('Error fetching category products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [categoryName])

  const handleInfoClick = (product: Product) => {
    setSelectedProduct(product)
    setIsInfoModalOpen(true)
  }

  const handleModalClose = () => {
    setIsInfoModalOpen(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading {categoryName} products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error Loading Products</h2>
          <p className={styles.errorMessage}>{error}</p>
          <Link href="/" className={styles.browseButton}>
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      {/* Category Header */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryIcon}>
          <Grid3x3 size={40} />
        </div>
        <h1 className={styles.categoryTitle}>{categoryName}</h1>
        <p className={styles.categoryDescription}>
          Explore our curated collection of {categoryName.toLowerCase()}
        </p>
        <span className={styles.productCount}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </span>
      </div>

      {/* Products Grid or Empty State */}
      {products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onInfoClick={handleInfoClick}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <Package size={60} />
          </div>
          <h2 className={styles.emptyTitle}>No Products Found</h2>
          <p className={styles.emptyMessage}>
            We don&apos;t have any products in this category yet. Check back soon or explore other categories!
          </p>
          <Link href="/" className={styles.browseButton}>
            <Home size={20} />
            Browse All Products
          </Link>
        </div>
      )}

      {/* Product Info Modal */}
      <ProductInfoModal 
        product={selectedProduct}
        isOpen={isInfoModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
