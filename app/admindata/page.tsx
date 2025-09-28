'use client'
import { useState, useEffect } from 'react'
import styles from './AdminData.module.css'

interface KeyFeature {
  feature_id: number
  feature_text: string
}

interface Material {
  material_id: number
  material_name: string
}

interface Color {
  color_id: number
  color_name: string
}

interface SearchKeyword {
  keyword_id: number
  keyword_text: string
}

interface RegionalSpeciality {
  regional_speciality_id: number
  regional_speciality_name: string
}

interface ArtFormType {
  art_form_type_id: number
  art_form_type_name: string
}

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  // Reference data state
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [searchKeywords, setSearchKeywords] = useState<SearchKeyword[]>([])
  const [regionalSpecialities, setRegionalSpecialities] = useState<RegionalSpeciality[]>([])
  const [artFormTypes, setArtFormTypes] = useState<ArtFormType[]>([])

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
      const [
        productsRes,
        categoriesRes,
        keyFeaturesRes,
        materialsRes,
        colorsRes,
        searchKeywordsRes,
        regionalSpecialitiesRes,
        artFormTypesRes
      ] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/key-features'),
        fetch('/api/admin/materials'),
        fetch('/api/admin/colors'),
        fetch('/api/admin/search-keywords'),
        fetch('/api/admin/regional-specialities'),
        fetch('/api/admin/art-form-types')
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (keyFeaturesRes.ok) {
        const keyFeaturesData = await keyFeaturesRes.json()
        setKeyFeatures(keyFeaturesData)
      }

      if (materialsRes.ok) {
        const materialsData = await materialsRes.json()
        setMaterials(materialsData)
      }

      if (colorsRes.ok) {
        const colorsData = await colorsRes.json()
        setColors(colorsData)
      }

      if (searchKeywordsRes.ok) {
        const searchKeywordsData = await searchKeywordsRes.json()
        setSearchKeywords(searchKeywordsData)
      }

      if (regionalSpecialitiesRes.ok) {
        const regionalSpecialitiesData = await regionalSpecialitiesRes.json()
        setRegionalSpecialities(regionalSpecialitiesData)
      }

      if (artFormTypesRes.ok) {
        const artFormTypesData = await artFormTypesRes.json()
        setArtFormTypes(artFormTypesData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  // Product CRUD operations
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = '/api/admin/products'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        loadData()
        setEditingProduct(null)
        setShowAddProduct(false)
        alert('Product saved successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadData()
        alert('Product deleted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  // Category CRUD operations
  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      const method = editingCategory ? 'PUT' : 'POST'
      const url = '/api/admin/categories'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        loadData()
        setEditingCategory(null)
        setShowAddCategory(false)
        alert('Category saved successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if it has products.')) return

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadData()
        alert('Category deleted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin Login</h1>
          <form onSubmit={handleAuth} className={styles.authForm}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authInput}
              required
            />
            <button type="submit" className={styles.authButton} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token')
                setIsAuthenticated(false)
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('products')}
          className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.model_name}</p>
                        <p className="text-sm text-gray-500">
                          {product.brand} | {product.category_name} | ₹{product.original_price}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <li key={category.category_id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.category_name}</p>
                        <p className="text-sm text-gray-500">{category.product_count} products</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.category_id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {(editingProduct || showAddProduct) && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setEditingProduct(null)
            setShowAddProduct(false)
          }}
          categories={categories}
          keyFeatures={keyFeatures}
          materials={materials}
          colors={colors}
          searchKeywords={searchKeywords}
          regionalSpecialities={regionalSpecialities}
          artFormTypes={artFormTypes}
        />
      )}

      {/* Category Edit Modal */}
      {(editingCategory || showAddCategory) && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setEditingCategory(null)
            setShowAddCategory(false)
          }}
        />
      )}
    </div>
  )
}

// Product Modal Component
function ProductModal({
  product,
  onSave,
  onClose,
  categories,
  keyFeatures,
  materials,
  colors,
  searchKeywords,
  regionalSpecialities,
  artFormTypes
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onClose: () => void
  categories: Category[]
  keyFeatures: KeyFeature[]
  materials: Material[]
  colors: Color[]
  searchKeywords: SearchKeyword[]
  regionalSpecialities: RegionalSpeciality[]
  artFormTypes: ArtFormType[]
}) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model Name *</label>
                  <input
                    type="text"
                    value={formData.model_name || ''}
                    onChange={(e) => setFormData({...formData, model_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value) || undefined})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || undefined})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cut Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cut_price || ''}
                    onChange={(e) => setFormData({...formData, cut_price: parseFloat(e.target.value) || undefined})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Images</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                  <input
                    type="url"
                    value={formData.main_image_url || ''}
                    onChange={(e) => setFormData({...formData, main_image_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Video URL</label>
                  <input
                    type="url"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {product ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Category Modal Component
function CategoryModal({
  category,
  onSave,
  onClose
}: {
  category: Category | null
  onSave: (data: Partial<Category>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<Partial<Category>>(category || {})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {category ? 'Edit Category' : 'Add Category'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={formData.category_name || ''}
                onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}