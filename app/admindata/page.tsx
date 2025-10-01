'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './AdminData.module.css'

interface Product {
  id: number
  pro_id?: string
  flipkart_serial_number?: string
  catalog_qc_status?: string
  qc_failed_reason?: string
  flipkart_product_link?: string
  product_data_status?: string
  disapproval_reason?: string
  seller_sku_id?: string
  brand?: string
  model_number?: string
  pack_of?: number
  width_inch?: number
  depth_inch?: number
  main_image_url?: string
  other_image_url_1?: string
  other_image_url_2?: string
  other_image_url_3?: string
  other_image_url_4?: string
  group_id?: string
  description?: string
  video_url?: string
  model_name: string
  brand_color?: string
  theme?: string
  design?: string
  finish?: string
  stand_included?: boolean
  embossment?: string
  regional_speciality_id?: number
  height_inch?: number
  art_form_type_id?: number
  diameter_inch?: number
  weight_g?: number
  other_dimensions?: string
  dishwasher_safe?: boolean
  microwave_safe?: boolean
  cold_proof?: boolean
  other_features?: string
  domestic_warranty?: number
  domestic_warranty_unit?: string
  international_warranty?: number
  international_warranty_unit?: string
  warranty_summary?: string
  warranty_service_type?: string
  covered_in_warranty?: string
  not_covered_in_warranty?: string
  ean_upc?: string
  gift_pack?: boolean
  supplier_image?: string
  is_fragile?: boolean
  category_id?: number
  // Related data
  category_name?: string
  regional_speciality_name?: string
  art_form_type_name?: string
  // Pricing
  original_price?: number
  cut_price?: number
  // Relationships (arrays of IDs)
  key_features?: number[]
  materials?: number[]
  colors?: number[]
  search_keywords?: number[]
}

interface Category {
  category_id: number
  category_name: string
  product_count: number
}

export default function AdminDataPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  // Authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_token', data.token)
        loadData()
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data
  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories')
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleEditProduct = (productId: number) => {
    router.push(`/admindata/edit/${productId}`)
  }

  const handleUpdateProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Trigger update without changes
      })

      if (response.ok) {
        alert('Product updated successfully!')
        loadData() // Refresh the data
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        alert('Product deleted successfully')
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete product')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(categories.filter(c => c.category_id !== categoryId))
        alert('Category deleted successfully')
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete category')
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.pro_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>🔐 Admin Login</h1>
            <form onSubmit={handleAuth} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={styles.loginBtn}
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>🛠️ Admin Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('admin_token')
            setIsAuthenticated(false)
          }}
          className={styles.logoutBtn}
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categories ({categories.length})
        </button>
      </div>

      {/* Search and Actions */}
      <div className={styles.actionBar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actionButtons}>
          {activeTab === 'products' && (
            <button
              onClick={() => router.push('/admindata/products/new')}
              className={styles.addBtn}
            >
              ➕ Add Product
            </button>
          )}
          {activeTab === 'categories' && (
            <button
              onClick={() => router.push('/admindata/categories/new')}
              className={styles.addBtn}
            >
              ➕ Add Category
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'products' && (
          <div className={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No products found</h3>
                <p>Start by adding your first product</p>
                <button
                  onClick={() => router.push('/admindata/products/new')}
                  className={styles.addBtn}
                >
                  ➕ Add Product
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageContainer}>
                    {product.main_image_url ? (
                      <Image
                        src={product.main_image_url}
                        alt={product.model_name}
                        width={120}
                        height={120}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>📷</div>
                    )}
                    <div className={styles.productBadge}>
                      {product.pro_id || `ID: ${product.id}`}
                    </div>
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.model_name}</h3>
                    <p className={styles.productMeta}>
                      <span className={styles.brand}>{product.brand}</span>
                      {product.category_name && (
                        <span className={styles.category}>{product.category_name}</span>
                      )}
                    </p>
                    
                    {product.description && (
                      <p className={styles.productDescription}>
                        {product.description.substring(0, 100)}
                        {product.description.length > 100 && '...'}
                      </p>
                    )}
                    
                    <div className={styles.productPricing}>
                      {product.cut_price && (
                        <span className={styles.cutPrice}>₹{product.cut_price}</span>
                      )}
                      {product.original_price && (
                        <span className={styles.originalPrice}>₹{product.original_price}</span>
                      )}
                    </div>
                    
                    <div className={styles.productDimensions}>
                      {product.width_inch && (
                        <span>W: {product.width_inch}&quot;</span>
                      )}
                      {product.height_inch && (
                        <span>H: {product.height_inch}&quot;</span>
                      )}
                      {product.depth_inch && (
                        <span>D: {product.depth_inch}&quot;</span>
                      )}
                      {product.weight_g && (
                        <span>{product.weight_g}g</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.productActions}>
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className={styles.updateBtn}
                    >
                      🔄 Update
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={styles.categoriesGrid}>
            {filteredCategories.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No categories found</h3>
                <p>Start by adding your first category</p>
                <button
                  onClick={() => router.push('/admindata/categories/new')}
                  className={styles.addBtn}
                >
                  ➕ Add Category
                </button>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.category_id} className={styles.categoryCard}>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryTitle}>{category.category_name}</h3>
                    <p className={styles.productCount}>
                      {category.product_count} products
                    </p>
                  </div>
                  
                  <div className={styles.categoryActions}>
                    <button
                      onClick={() => router.push(`/admindata/categories/edit/${category.category_id}`)}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.category_id)}
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}