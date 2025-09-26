'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  CreditCard,
  Minus,
  Plus,
  ArrowLeft,
  Ruler,
  Palette,
  Package,
  Star,
  Info
} from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { useNotification } from '@/app/context/NotificationContext'
import styles from './ProductDetails.module.css'

interface Product {
  id: number
  pro_id: string
  model_name: string
  design: string
  depth_inch: number
  height_inch: number
  weight_g: number
  other_features: string
  main_image_url: string
  other_image_url_1?: string
  other_image_url_2?: string
  other_image_url_3?: string
  other_image_url_4?: string
  brand: string
  description: string
  category_id: number
  category_name: string
  width_inch: number
  diameter_inch: number
  theme: string
  finish: string
  embossment: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { showNotification } = useNotification()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  // Preload all images and track loading state
  useEffect(() => {
    if (product) {
      const productImages = getProductImages(product)
      const loadedImages = new Set<number>()

      productImages.forEach((imageUrl, index) => {
        const img = new window.Image()
        img.onload = () => {
          loadedImages.add(index)
          setImagesLoaded(new Set(loadedImages))
        }
        img.src = imageUrl
      })
    }
  }, [product])

  const categoryParam = params.category as string
  const productId = params.id as string

  // Get all available images
  const getProductImages = (product: Product): string[] => {
    const images: string[] = []
    if (product.main_image_url) images.push(product.main_image_url)
    if (product.other_image_url_1) images.push(product.other_image_url_1)
    if (product.other_image_url_2) images.push(product.other_image_url_2)
    if (product.other_image_url_3) images.push(product.other_image_url_3)
    if (product.other_image_url_4) images.push(product.other_image_url_4)
    return images
  }

  // Format category name for URL comparison
  const formatCategoryName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '')
  }

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        // Fetch product by pro_id
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const productData = await response.json()
        
        // Fetch category to verify URL
        const categoryResponse = await fetch(`/api/categories/${productData.category_id}`)
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          const expectedCategoryUrl = formatCategoryName(categoryData.category_name)
          
          // Verify category matches URL
          if (expectedCategoryUrl !== categoryParam) {
            throw new Error('Invalid category URL')
          }
        }
        
        setProduct(productData)
        setSelectedImageIndex(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (categoryParam && productId) {
      fetchProduct()
    }
  }, [categoryParam, productId])

  const handleAddToCart = () => {
    if (!product) return
    
    const cartItem = {
      id: product.pro_id,  // Use pro_id as the cart item ID
      name: product.model_name,
      image: product.main_image_url,
      price: 2999, // You'll need to add price to your product data
      category: product.category_name || 'General'
    }
    
    addItem(cartItem, quantity)
    showNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.model_name} added to cart!`
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout or cart
    router.push('/cart')
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleImageSelect = (index: number) => {
    if (index !== selectedImageIndex && imagesLoaded.has(index)) {
      setIsImageTransitioning(true)
      setSelectedImageIndex(index)

      // Reset transition state after animation
      setTimeout(() => {
        setIsImageTransitioning(false)
      }, 300)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Package className="w-8 h-8" />
          </motion.div>
          <span className="ml-2">Loading product details...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1 className={styles.errorTitle}>Product Not Found</h1>
          <p className={styles.errorMessage}>
            {error || 'The product you\'re looking for doesn\'t exist.'}
          </p>
          <button 
            onClick={() => router.back()} 
            className={styles.backButton}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const images = getProductImages(product)

  return (
    <div className={styles.container}>
      {/* Breadcrumb / Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className={styles.backToProducts}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </motion.button>

      {/* Main Product Section */}
      <motion.div 
        className={styles.productSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Image Gallery */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImageContainer}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.model_name} view ${index + 1}`}
                className={`${styles.mainImage} ${index === selectedImageIndex ? styles.active : ''} ${isImageTransitioning ? styles.transitioning : ''}`}
                style={{
                  opacity: index === selectedImageIndex ? 1 : 0,
                  zIndex: index === selectedImageIndex ? 2 : 1,
                  display: imagesLoaded.has(index) ? 'block' : 'none'
                }}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
            {/* Loading placeholder */}
            {!imagesLoaded.has(selectedImageIndex) && (
              <div className={styles.imagePlaceholder}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.active : ''}`}
                  onClick={() => handleImageSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${product.model_name} view ${index + 1}`}
                    className={styles.thumbnailImage}
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className={styles.productDetails}>
          <motion.h1 
            className={styles.productTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.model_name}
          </motion.h1>

          {/* Details Grid */}
          <motion.div 
            className={styles.detailsGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Design & Style */}
            <div className={styles.detailSection}>
              <div className={styles.detailTitle}>
                <Palette className={styles.detailIcon} />
                Design & Style
              </div>
              <div className={styles.detailContent}>
                <ul className={styles.detailList}>
                  {product.design && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Design:</span>
                      <span className={styles.detailValue}>{product.design}</span>
                    </li>
                  )}
                  {product.theme && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Theme:</span>
                      <span className={styles.detailValue}>{product.theme}</span>
                    </li>
                  )}
                  {product.finish && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Finish:</span>
                      <span className={styles.detailValue}>{product.finish}</span>
                    </li>
                  )}
                  {product.embossment && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Embossment:</span>
                      <span className={styles.detailValue}>{product.embossment}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Dimensions */}
            <div className={styles.detailSection}>
              <div className={styles.detailTitle}>
                <Ruler className={styles.detailIcon} />
                Dimensions & Weight
              </div>
              <div className={styles.detailContent}>
                <ul className={styles.detailList}>
                  {product.height_inch && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Height:</span>
                      <span className={styles.detailValue}>{product.height_inch}&quot;</span>
                    </li>
                  )}
                  {product.depth_inch && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Depth:</span>
                      <span className={styles.detailValue}>{product.depth_inch}&quot;</span>
                    </li>
                  )}
                  {product.width_inch && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Width:</span>
                      <span className={styles.detailValue}>{product.width_inch}&quot;</span>
                    </li>
                  )}
                  {product.diameter_inch && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Diameter:</span>
                      <span className={styles.detailValue}>{product.diameter_inch}&quot;</span>
                    </li>
                  )}
                  {product.weight_g && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Weight:</span>
                      <span className={styles.detailValue}>{product.weight_g}g</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Features */}
            {product.other_features && (
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>
                  <Star className={styles.detailIcon} />
                  Features
                </div>
                <div className={styles.detailContent}>
                  {product.other_features}
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className={styles.detailSection}>
              <div className={styles.detailTitle}>
                <Info className={styles.detailIcon} />
                Product Information
              </div>
              <div className={styles.detailContent}>
                <ul className={styles.detailList}>
                  <li className={styles.detailListItem}>
                    <span className={styles.detailLabel}>Model:</span>
                    <span className={styles.detailValue}>{product.model_name}</span>
                  </li>
                  <li className={styles.detailListItem}>
                    <span className={styles.detailLabel}>Brand:</span>
                    <span className={styles.detailValue}>{product.brand}</span>
                  </li>
                  <li className={styles.detailListItem}>
                    <span className={styles.detailLabel}>Product ID:</span>
                    <span className={styles.detailValue}>{product.pro_id}</span>
                  </li>
                </ul>
                {product.description && (
                  <p className="mt-3 text-gray-600">{product.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Section */}
      <motion.div 
        className={styles.actionSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={styles.priceSection}>
          <div className={styles.price}>₹2,999</div>
        </div>

        {/* Quantity Selector */}
        <div className={styles.quantitySection}>
          <label className={styles.quantityLabel}>Quantity:</label>
          <div className={styles.quantitySelector}>
            <button 
              className={styles.quantityButton}
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus />
            </button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button 
              className={styles.quantityButton}
              onClick={incrementQuantity}
            >
              <Plus />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <motion.button
            className={`${styles.actionButton} ${styles.addToCartBtn}`}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.button>
          
          <motion.button
            className={`${styles.actionButton} ${styles.buyNowBtn}`}
            onClick={handleBuyNow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard className="w-5 h-5" />
            Buy Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}