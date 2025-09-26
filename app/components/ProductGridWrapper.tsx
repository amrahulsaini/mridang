'use client'

import { useState } from 'react'
import CategorySection from './CategorySection'
import ProductInfoModal from './ProductInfoModal'
import { Product } from '../types'

interface ProductGridWrapperProps {
  categoriesWithProducts: { category: string; products: Product[] }[]
}

const ProductGridWrapper: React.FC<ProductGridWrapperProps> = ({ categoriesWithProducts }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const handleInfoClick = (product: Product) => {
    setSelectedProduct(product)
    setIsInfoModalOpen(true)
  }

  const handleModalClose = () => {
    setIsInfoModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      {/* Dynamically render only categories that have products from database */}
      {categoriesWithProducts.map((categoryData, index) => (
        <div key={categoryData.category} className={index % 2 === 0 ? 'section-cream' : 'bg-white'}>
          <CategorySection 
            title={categoryData.category}
            products={categoryData.products}
            onInfoClick={handleInfoClick}
          />
        </div>
      ))}

      {/* Product Info Modal - Renders over entire page */}
      <ProductInfoModal 
        product={selectedProduct}
        isOpen={isInfoModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}

export default ProductGridWrapper