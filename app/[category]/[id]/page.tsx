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
  Star
} from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { useNotification } from '@/app/context/NotificationContext'
import Image from 'next/image'
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
  custom_key_features?: string
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
  is_fragile?: number
  stand_included?: number
  materials: string[]
  colors: string[]
  price: number
  cut_price?: number
  original_price?: number
  stock_quantity?: number
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

  // Price calculation functions
  const getUnitPrice = () => {
    if (!product) return 0
    // Use cut_price if available, otherwise use price, otherwise default to 2999
    return product.cut_price || product.price || 2999
  }

  const getTotalPrice = () => {
    return getUnitPrice() * quantity
  }

  const getOriginalTotalPrice = () => {
    if (!product) return 0
    // Use original_price if available, otherwise use price, otherwise default to 2999
    const originalPrice = product.original_price || product.price || 2999
    return originalPrice * quantity
  }

  const hasDiscount = () => {
    if (!product) return false
    const originalPrice = product.original_price || product.price || 0
    const currentPrice = product.cut_price || product.price || 0
    return product.cut_price && currentPrice < originalPrice && originalPrice > 0
  }

  const getDiscountPercentage = () => {
    if (!hasDiscount() || !product) return 0
    const original = product.original_price || product.price || 0
    const current = product.cut_price || product.price || 0
    if (original === 0) return 0
    return Math.round(((original - current) / original) * 100)
  }

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
        
        // Debug: Log pricing data
        console.log('Product data received:', {
          price: productData.price,
          cut_price: productData.cut_price,
          original_price: productData.original_price,
          fullData: productData
        })
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
      price: getUnitPrice(), // Use dynamic pricing
      originalPrice: product.original_price || product.price,
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
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingSpinnerWrapper}>
          {/* Multi-ring modern spinner */}
          <motion.div
            className={styles.spinnerRingOuter}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={styles.spinnerRingMiddle}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={styles.spinnerRingInner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={styles.spinnerDot}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className={styles.loadingTextWrapper}>
          <p className={styles.loadingText}>Loading Product</p>
          <div className={styles.loadingDots}>
            <motion.span
              className={styles.dot}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
            >
              •
            </motion.span>
            <motion.span
              className={styles.dot}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            >
              •
            </motion.span>
            <motion.span
              className={styles.dot}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
            >
              •
            </motion.span>
          </div>
        </div>
      </div>
    )\n  }

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
              <Image
                key={index}
                src={image}
                alt={`${product.model_name} view ${index + 1}`}
                width={600}
                height={600}
                className={`${styles.mainImage} ${index === selectedImageIndex ? styles.active : ''} ${isImageTransitioning ? styles.transitioning : ''}`}
                style={{
                  opacity: index === selectedImageIndex ? 1 : 0,
                  zIndex: index === selectedImageIndex ? 2 : 1,
                  display: imagesLoaded.has(index) ? 'block' : 'none'
                }}
                priority={index === 0}
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
                  <Image
                    src={image}
                    alt={`${product.model_name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className={styles.thumbnailImage}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Product Title */}
        <div className={styles.productDetails}>
          <motion.h1 
            className={styles.productTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.model_name}
          </motion.h1>

          {/* Quick Buy Section at Top */}
          <motion.div 
            className={styles.topActionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Price Section */}
            <div className={styles.priceSection}>
              {hasDiscount() ? (
                <div className={styles.priceContainer}>
                  <div className={styles.currentPrice}>₹{getTotalPrice().toLocaleString('en-IN')}</div>
                  <div className={styles.originalPrice}>₹{getOriginalTotalPrice().toLocaleString('en-IN')}</div>
                  <div className={styles.discount}>{getDiscountPercentage()}% OFF</div>
                </div>
              ) : (
                <div className={styles.price}>₹{getTotalPrice().toLocaleString('en-IN')}</div>
              )}
              {quantity > 1 && (
                <div className={styles.unitPrice}>
                  Unit Price: ₹{getUnitPrice().toLocaleString('en-IN')}
                </div>
              )}
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
      </motion.div>

      {/* Details Grid - Full Width */}
      <motion.div 
        className={styles.detailsGridWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.detailsGrid}>
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
                  {product.is_fragile !== undefined && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Fragile:</span>
                      <span className={styles.detailValue}>{product.is_fragile ? 'Yes' : 'No'}</span>
                    </li>
                  )}
                  {product.stand_included !== undefined && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Stand Included:</span>
                      <span className={styles.detailValue}>{product.stand_included ? 'Yes' : 'No'}</span>
                    </li>
                  )}
                  {product.materials && product.materials.length > 0 && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Materials:</span>
                      <span className={styles.detailValue}>{product.materials.join(', ')}</span>
                    </li>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <li className={styles.detailListItem}>
                      <span className={styles.detailLabel}>Colors:</span>
                      <span className={styles.detailValue}>{product.colors.join(', ')}</span>
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

            {/* Key Features */}
            {product.custom_key_features && (
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>
                  <Star className={styles.detailIcon} />
                  Key Features
                </div>
                <div className={styles.detailContent}>
                  <ul className={styles.featuresList}>
                    {product.custom_key_features.split('\n').filter(line => line.trim()).map((feature, index) => (
                      <li key={index} className={styles.featureItem}>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Other Features */}
            {product.other_features && (
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>
                  <Package className={styles.detailIcon} />
                  Additional Features
                </div>
                <div className={styles.detailContent}>
                  <ul className={styles.featuresList}>
                    {product.other_features
                      .split('.')
                      .map(line => line.trim())
                      .filter(line => line.length > 0)
                      .map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

        </div>
      </motion.div>

      {/* Action Section */}
      <motion.div 
        className={styles.actionSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Price Section */}
        <div className={styles.priceSection}>
          {hasDiscount() ? (
            <div className={styles.priceContainer}>
              <div className={styles.currentPrice}>₹{getTotalPrice().toLocaleString('en-IN')}</div>
              <div className={styles.originalPrice}>₹{getOriginalTotalPrice().toLocaleString('en-IN')}</div>
              <div className={styles.discount}>{getDiscountPercentage()}% OFF</div>
            </div>
          ) : (
            <div className={styles.price}>₹{getTotalPrice().toLocaleString('en-IN')}</div>
          )}
          {quantity > 1 && (
            <div className={styles.unitPrice}>
              Unit Price: ₹{getUnitPrice().toLocaleString('en-IN')}
            </div>
          )}
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