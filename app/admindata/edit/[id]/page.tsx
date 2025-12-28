'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../AdminData.module.css'

interface Material {
  material_id: number
  material_name: string
}

interface Color {
  color_id: number
  color_name: string
}

interface RegionalSpeciality {
  regional_speciality_id: number
  regional_speciality_name: string
}

interface ArtFormType {
  art_form_type_id: number
  art_form_type_name: string
}

interface Category {
  category_id: number
  category_name: string
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
  // Custom key features text (free-form text)
  custom_key_features?: string
  // Relationships (arrays of IDs)
  materials?: number[]
  colors?: number[]
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'new'

  const [formData, setFormData] = useState<Partial<Product>>({})
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({})

  // Dialog state
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'confirm'
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  // Reference data
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [regionalSpecialities, setRegionalSpecialities] = useState<RegionalSpeciality[]>([])
  const [artFormTypes, setArtFormTypes] = useState<ArtFormType[]>([])

  const loadProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      if (response.ok) {
        const productData = await response.json()
        setFormData(productData)
      } else {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Product Not Found',
          message: 'The requested product could not be found.',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            router.push('/admindata');
          }
        });
      }
    } catch (error) {
      console.error('Error loading product:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Loading Error',
        message: 'An error occurred while loading the product.',
        onConfirm: () => {
          setDialog(prev => ({ ...prev, isOpen: false }));
          router.push('/admindata');
        }
      });
    } finally {
      setIsLoading(false)
    }
  }, [productId, router])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admindata')
      return
    }

    loadReferenceData()

    if (!isNew) {
      loadProduct()
    } else {
      setFormData({
        model_name: '',
        brand: '',
        description: '',
        original_price: 0,
        cut_price: 0,
        custom_key_features: '',
        materials: [],
        colors: []
      })
    }
  }, [productId, isNew, router, loadProduct])

  const loadReferenceData = async () => {
    try {
      const [
        categoriesRes,
        materialsRes,
        colorsRes,
        regionalSpecialitiesRes,
        artFormTypesRes
      ] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/materials'),
        fetch('/api/admin/colors'),
        fetch('/api/admin/regional-specialities'),
        fetch('/api/admin/art-form-types')
      ])

      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (materialsRes.ok) setMaterials(await materialsRes.json())
      if (colorsRes.ok) setColors(await colorsRes.json())
      if (regionalSpecialitiesRes.ok) setRegionalSpecialities(await regionalSpecialitiesRes.json())
      if (artFormTypesRes.ok) setArtFormTypes(await artFormTypesRes.json())
    } catch (error) {
      console.error('Error loading reference data:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      if (!formData.model_name?.trim()) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Model name is required'
        });
        setIsSaving(false);
        return;
      }

      const saveData = {
        ...formData,
        // Convert all Dropbox image URLs to direct links before saving
        main_image_url: formData.main_image_url && formData.main_image_url.trim() ? convertDropboxUrl(formData.main_image_url.trim()) : null,
        other_image_url_1: formData.other_image_url_1 && formData.other_image_url_1.trim() ? convertDropboxUrl(formData.other_image_url_1.trim()) : null,
        other_image_url_2: formData.other_image_url_2 && formData.other_image_url_2.trim() ? convertDropboxUrl(formData.other_image_url_2.trim()) : null,
        other_image_url_3: formData.other_image_url_3 && formData.other_image_url_3.trim() ? convertDropboxUrl(formData.other_image_url_3.trim()) : null,
        other_image_url_4: formData.other_image_url_4 && formData.other_image_url_4.trim() ? convertDropboxUrl(formData.other_image_url_4.trim()) : null,
        supplier_image: formData.supplier_image && formData.supplier_image.trim() ? convertDropboxUrl(formData.supplier_image.trim()) : null,
        // Ensure numeric fields are properly formatted
        pack_of: formData.pack_of ? parseInt(String(formData.pack_of)) : null,
        width_inch: formData.width_inch ? parseFloat(String(formData.width_inch)) : null,
        depth_inch: formData.depth_inch ? parseFloat(String(formData.depth_inch)) : null,
        height_inch: formData.height_inch ? parseFloat(String(formData.height_inch)) : null,
        diameter_inch: formData.diameter_inch ? parseFloat(String(formData.diameter_inch)) : null,
        weight_g: formData.weight_g ? parseFloat(String(formData.weight_g)) : null,
        original_price: formData.original_price ? parseFloat(String(formData.original_price)) : null,
        cut_price: formData.cut_price ? parseFloat(String(formData.cut_price)) : null,
        domestic_warranty: formData.domestic_warranty ? parseInt(String(formData.domestic_warranty)) : null,
        international_warranty: formData.international_warranty ? parseInt(String(formData.international_warranty)) : null,
        regional_speciality_id: formData.regional_speciality_id ? parseInt(String(formData.regional_speciality_id)) : null,
        art_form_type_id: formData.art_form_type_id ? parseInt(String(formData.art_form_type_id)) : null,
        category_id: formData.category_id ? parseInt(String(formData.category_id)) : null,
      };

      console.log('=== FRONTEND SAVE DATA ===');
      console.log('isNew:', isNew);
      console.log('Image URLs being sent:', {
        main_image_url: saveData.main_image_url,
        other_image_url_1: saveData.other_image_url_1,
        other_image_url_2: saveData.other_image_url_2,
        other_image_url_3: saveData.other_image_url_3,
        other_image_url_4: saveData.other_image_url_4,
        supplier_image: saveData.supplier_image
      });
      console.log('Full save data:', saveData);

      const method = isNew ? 'POST' : 'PUT'
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      if (response.ok) {
        const savedProduct = await response.json();
        console.log('Save response:', savedProduct);
        
        // Determine the product ID to reload
        const reloadId = isNew && savedProduct.productId ? savedProduct.productId : productId;
        
        // For new products, update the URL
        if (isNew && savedProduct.productId) {
          window.history.replaceState({}, '', `/admindata/edit/${savedProduct.productId}`);
        }
        
        // Always reload the product data from the server to get the saved values
        const reloadResponse = await fetch(`/api/admin/products/${reloadId}`);
        if (reloadResponse.ok) {
          const reloadedProduct = await reloadResponse.json();
          console.log('Reloaded product:', reloadedProduct);
          setFormData(reloadedProduct);
        }
        
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Product saved successfully!',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            // Reload the page to ensure fresh data
            if (isNew && savedProduct.productId) {
              window.location.href = `/admindata/edit/${savedProduct.productId}`;
            }
          }
        });
      } else {
        const error = await response.json()
        console.error('Save failed:', error);
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Save Failed',
          message: `Failed to save product: ${error.details || error.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error saving product:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to save product. Please check console for details.'
      });
    } finally {
      setIsSaving(false)
    }
  }

  const handleArrayFieldChange = (field: string, value: number, checked: boolean) => {
    const currentArray: number[] = (() => {
      switch (field) {
        case 'materials': return formData.materials || []
        case 'colors': return formData.colors || []
        default: return []
      }
    })()
    
    let newArray: number[]
    
    if (checked) {
      newArray = [...currentArray, value]
    } else {
      newArray = currentArray.filter((item: number) => item !== value)
    }
    
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload only JPEG, PNG, WebP, or GIF images'
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'File Too Large',
        message: 'Image size must be less than 5MB'
      })
      return
    }

    setUploadingImages(prev => ({ ...prev, [fieldName]: true }))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, [fieldName]: data.imageUrl }))
      } else {
        const error = await response.json()
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Upload Failed',
          message: error.error || 'Failed to upload image'
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Upload Error',
        message: 'An error occurred while uploading the image'
      })
    } finally {
      setUploadingImages(prev => ({ ...prev, [fieldName]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <h2>Loading product...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admindata" className={styles.backButton}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </Link>
        <h1 className={styles.pageTitle}>
          {isNew ? '➕ Add New Product' : `✏️ Edit Product`}
        </h1>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className={styles.editForm}>
        <div className={styles.formSections}>
          
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📝 Basic Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product ID (Read-only)</label>
                <input
                  type="text"
                  value={formData.pro_id || 'Auto-generated'}
                  readOnly
                  className={`${styles.input} ${styles.readOnly}`}
                  placeholder="Auto-generated"
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Model Name *</label>
                <input
                  type="text"
                  value={formData.model_name || ''}
                  onChange={(e) => setFormData({...formData, model_name: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Brand</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Model Number</label>
                <input
                  type="text"
                  value={formData.model_number || ''}
                  onChange={(e) => setFormData({...formData, model_number: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value) || undefined})}
                  className={styles.select}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Seller SKU ID</label>
                <input
                  type="text"
                  value={formData.seller_sku_id || ''}
                  onChange={(e) => setFormData({...formData, seller_sku_id: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pack Of</label>
                <input
                  type="number"
                  value={formData.pack_of || ''}
                  onChange={(e) => setFormData({...formData, pack_of: parseInt(e.target.value) || undefined})}
                  className={styles.input}
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Group ID</label>
                <input
                  type="text"
                  value={formData.group_id || ''}
                  onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>EAN/UPC</label>
                <input
                  type="text"
                  value={formData.ean_upc || ''}
                  onChange={(e) => setFormData({...formData, ean_upc: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Enter product description..."
                />
              </div>
            </div>

            {/* Section Update Button */}
            <div className={styles.sectionUpdateButton}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={styles.updateSectionBtn}
              >
                {isSaving ? 'Updating...' : 'Update Basic Info'}
              </button>
            </div>
          </div>

          {/* Flipkart Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🛒 Flipkart Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Flipkart Serial Number</label>
                <input
                  type="text"
                  value={formData.flipkart_serial_number || ''}
                  onChange={(e) => setFormData({...formData, flipkart_serial_number: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Catalog QC Status</label>
                <input
                  type="text"
                  value={formData.catalog_qc_status || ''}
                  onChange={(e) => setFormData({...formData, catalog_qc_status: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Product Data Status</label>
                <input
                  type="text"
                  value={formData.product_data_status || ''}
                  onChange={(e) => setFormData({...formData, product_data_status: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>QC Failed Reason</label>
                <input
                  type="text"
                  value={formData.qc_failed_reason || ''}
                  onChange={(e) => setFormData({...formData, qc_failed_reason: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Disapproval Reason</label>
                <input
                  type="text"
                  value={formData.disapproval_reason || ''}
                  onChange={(e) => setFormData({...formData, disapproval_reason: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Flipkart Product Link</label>
                <input
                  type="url"
                  value={formData.flipkart_product_link || ''}
                  onChange={(e) => setFormData({...formData, flipkart_product_link: e.target.value})}
                  className={styles.input}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📷 Product Images</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Main Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'main_image_url')}
                  className={styles.input}
                  disabled={uploadingImages['main_image_url']}
                />
                {uploadingImages['main_image_url'] && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Uploading...</p>
                )}
                {formData.main_image_url && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={convertDropboxUrl(formData.main_image_url)}
                      alt="Main product image"
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, main_image_url: ''})}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Other Image 1</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'other_image_url_1')}
                  className={styles.input}
                  disabled={uploadingImages['other_image_url_1']}
                />
                {uploadingImages['other_image_url_1'] && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Uploading...</p>
                )}
                {formData.other_image_url_1 && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={convertDropboxUrl(formData.other_image_url_1)}
                      alt="Product image 1"
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, other_image_url_1: ''})}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Other Image 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'other_image_url_2')}
                  className={styles.input}
                  disabled={uploadingImages['other_image_url_2']}
                />
                {uploadingImages['other_image_url_2'] && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Uploading...</p>
                )}
                {formData.other_image_url_2 && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={convertDropboxUrl(formData.other_image_url_2)}
                      alt="Product image 2"
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, other_image_url_2: ''})}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Other Image 3</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'other_image_url_3')}
                  className={styles.input}
                  disabled={uploadingImages['other_image_url_3']}
                />
                {uploadingImages['other_image_url_3'] && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Uploading...</p>
                )}
                {formData.other_image_url_3 && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={convertDropboxUrl(formData.other_image_url_3)}
                      alt="Product image 3"
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, other_image_url_3: ''})}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Other Image 4</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'other_image_url_4')}
                  className={styles.input}
                  disabled={uploadingImages['other_image_url_4']}
                />
                {uploadingImages['other_image_url_4'] && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Uploading...</p>
                )}
                {formData.other_image_url_4 && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={convertDropboxUrl(formData.other_image_url_4)}
                      alt="Product image 4"
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, other_image_url_4: ''})}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Video URL</label>
                <input
                  type="url"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📏 Dimensions & Weight</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Width (inches)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.width_inch || ''}
                  onChange={(e) => setFormData({...formData, width_inch: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Height (inches)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.height_inch || ''}
                  onChange={(e) => setFormData({...formData, height_inch: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Depth (inches)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.depth_inch || ''}
                  onChange={(e) => setFormData({...formData, depth_inch: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Diameter (inches)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.diameter_inch || ''}
                  onChange={(e) => setFormData({...formData, diameter_inch: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Weight (grams)</label>
                <input
                  type="number"
                  value={formData.weight_g || ''}
                  onChange={(e) => setFormData({...formData, weight_g: parseInt(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pack of</label>
                <input
                  type="number"
                  value={formData.pack_of || ''}
                  onChange={(e) => setFormData({...formData, pack_of: parseInt(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Other Dimensions</label>
                <textarea
                  value={formData.other_dimensions || ''}
                  onChange={(e) => setFormData({...formData, other_dimensions: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>💰 Pricing</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Original Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cut Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cut_price || ''}
                  onChange={(e) => setFormData({...formData, cut_price: parseFloat(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Section Update Button */}
            <div className={styles.sectionUpdateButton}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={styles.updateSectionBtn}
              >
                {isSaving ? 'Updating...' : 'Update Pricing'}
              </button>
            </div>
          </div>

          {/* Product Features Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🎨 Product Features</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Theme</label>
                <input
                  type="text"
                  value={formData.theme || ''}
                  onChange={(e) => setFormData({...formData, theme: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Design</label>
                <input
                  type="text"
                  value={formData.design || ''}
                  onChange={(e) => setFormData({...formData, design: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Finish</label>
                <input
                  type="text"
                  value={formData.finish || ''}
                  onChange={(e) => setFormData({...formData, finish: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Embossment</label>
                <input
                  type="text"
                  value={formData.embossment || ''}
                  onChange={(e) => setFormData({...formData, embossment: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Regional Speciality</label>
                <select
                  value={formData.regional_speciality_id || ''}
                  onChange={(e) => setFormData({...formData, regional_speciality_id: parseInt(e.target.value) || undefined})}
                  className={styles.select}
                >
                  <option value="">Select Regional Speciality</option>
                  {regionalSpecialities.map((rs) => (
                    <option key={rs.regional_speciality_id} value={rs.regional_speciality_id}>
                      {rs.regional_speciality_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Art Form Type</label>
                <select
                  value={formData.art_form_type_id || ''}
                  onChange={(e) => setFormData({...formData, art_form_type_id: parseInt(e.target.value) || undefined})}
                  className={styles.select}
                >
                  <option value="">Select Art Form Type</option>
                  {artFormTypes.map((aft) => (
                    <option key={aft.art_form_type_id} value={aft.art_form_type_id}>
                      {aft.art_form_type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Other Features</label>
                <textarea
                  value={formData.other_features || ''}
                  onChange={(e) => setFormData({...formData, other_features: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Boolean Features Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>✅ Product Properties</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.stand_included || false}
                    onChange={(e) => setFormData({...formData, stand_included: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Stand Included
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.dishwasher_safe || false}
                    onChange={(e) => setFormData({...formData, dishwasher_safe: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Dishwasher Safe
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.microwave_safe || false}
                    onChange={(e) => setFormData({...formData, microwave_safe: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Microwave Safe
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.cold_proof || false}
                    onChange={(e) => setFormData({...formData, cold_proof: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Cold Proof
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.gift_pack || false}
                    onChange={(e) => setFormData({...formData, gift_pack: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Gift Pack
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.is_fragile || false}
                    onChange={(e) => setFormData({...formData, is_fragile: e.target.checked})}
                    className={styles.checkbox}
                  />
                  Is Fragile
                </label>
              </div>
            </div>
          </div>

          {/* Warranty Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🛡️ Warranty Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Domestic Warranty (Number)</label>
                <input
                  type="number"
                  value={formData.domestic_warranty || ''}
                  onChange={(e) => setFormData({...formData, domestic_warranty: parseInt(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Domestic Warranty Unit</label>
                <select
                  value={formData.domestic_warranty_unit || ''}
                  onChange={(e) => setFormData({...formData, domestic_warranty_unit: e.target.value})}
                  className={styles.select}
                >
                  <option value="">Select Unit</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                  <option value="days">Days</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>International Warranty (Number)</label>
                <input
                  type="number"
                  value={formData.international_warranty || ''}
                  onChange={(e) => setFormData({...formData, international_warranty: parseInt(e.target.value) || undefined})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>International Warranty Unit</label>
                <select
                  value={formData.international_warranty_unit || ''}
                  onChange={(e) => setFormData({...formData, international_warranty_unit: e.target.value})}
                  className={styles.select}
                >
                  <option value="">Select Unit</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                  <option value="days">Days</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Warranty Service Type</label>
                <input
                  type="text"
                  value={formData.warranty_service_type || ''}
                  onChange={(e) => setFormData({...formData, warranty_service_type: e.target.value})}
                  className={styles.input}
                  placeholder="e.g., Onsite, Carry-in"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Supplier Image URL</label>
                <input
                  type="url"
                  value={formData.supplier_image || ''}
                  onChange={(e) => setFormData({...formData, supplier_image: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Warranty Summary</label>
                <textarea
                  value={formData.warranty_summary || ''}
                  onChange={(e) => setFormData({...formData, warranty_summary: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Brief warranty summary..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Covered in Warranty</label>
                <textarea
                  value={formData.covered_in_warranty || ''}
                  onChange={(e) => setFormData({...formData, covered_in_warranty: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                  placeholder="What's covered..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Not Covered in Warranty</label>
                <textarea
                  value={formData.not_covered_in_warranty || ''}
                  onChange={(e) => setFormData({...formData, not_covered_in_warranty: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                  placeholder="What's not covered..."
                />
              </div>
            </div>
          </div>

          {/* Product Properties Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>✓ Product Properties</h3>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.stand_included || false}
                  onChange={(e) => setFormData({...formData, stand_included: e.target.checked})}
                  className={styles.checkbox}
                />
                Stand Included
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.dishwasher_safe || false}
                  onChange={(e) => setFormData({...formData, dishwasher_safe: e.target.checked})}
                  className={styles.checkbox}
                />
                Dishwasher Safe
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.microwave_safe || false}
                  onChange={(e) => setFormData({...formData, microwave_safe: e.target.checked})}
                  className={styles.checkbox}
                />
                Microwave Safe
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.cold_proof || false}
                  onChange={(e) => setFormData({...formData, cold_proof: e.target.checked})}
                  className={styles.checkbox}
                />
                Cold Proof
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.gift_pack || false}
                  onChange={(e) => setFormData({...formData, gift_pack: e.target.checked})}
                  className={styles.checkbox}
                />
                Gift Pack
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.is_fragile || false}
                  onChange={(e) => setFormData({...formData, is_fragile: e.target.checked})}
                  className={styles.checkbox}
                />
                Fragile
              </label>
            </div>
          </div>

          {/* Materials Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🧱 Materials</h3>
            <div className={styles.checkboxGrid}>
              {materials.map((material) => (
                <label key={material.material_id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={(formData.materials || []).includes(material.material_id)}
                    onChange={(e) => handleArrayFieldChange('materials', material.material_id, e.target.checked)}
                    className={styles.checkbox}
                  />
                  {material.material_name}
                </label>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>🎨 Colors</h3>
            <div className={styles.checkboxGrid}>
              {colors.map((color) => (
                <label key={color.color_id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={(formData.colors || []).includes(color.color_id)}
                    onChange={(e) => handleArrayFieldChange('colors', color.color_id, e.target.checked)}
                    className={styles.checkbox}
                  />
                  {color.color_name}
                </label>
              ))}
            </div>
          </div>

          {/* Key Features Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>⭐ Key Features</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Key Features (One per line)</label>
                <textarea
                  value={formData.custom_key_features || ''}
                  onChange={(e) => setFormData({...formData, custom_key_features: e.target.value})}
                  className={styles.textarea}
                  rows={8}
                  placeholder="Enter each key feature on a new line (press Enter after each feature):

• Handcrafted Design
• Premium Quality Material  
• Eco-friendly and Sustainable
• Durable Construction
• Easy to Clean and Maintain
• Lightweight and Portable
• Perfect for Gifting"
                  style={{ 
                    fontFamily: 'monospace',
                    lineHeight: '1.6'
                  }}
                />
                <small className={styles.helpText}>
                  <strong>📝 How to add features:</strong> Type each feature and press <strong>Enter</strong> to start a new line. You can add bullet points (•, -, *) or just plain text. Each line will be displayed as a separate feature on the product page.
                </small>
              </div>
            </div>

            {/* Section Update Button */}
            <div className={styles.sectionUpdateButton}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={styles.updateSectionBtn}
              >
                {isSaving ? 'Updating...' : 'Update Key Features'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className={styles.submitSection}>
          <button
            type="button"
            onClick={() => router.push('/admindata')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className={styles.submitBtn}
          >
            <svg className={styles.submitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isSaving ? 'Saving...' : (isNew ? 'Create Product' : 'Save & Continue Editing')}
          </button>
          
          <button
            type="button"
            onClick={async (e) => {
              await handleSave(e as React.FormEvent);
              // After save completes successfully, redirect
              setTimeout(() => {
                if (!dialog.isOpen || dialog.type === 'success') {
                  router.push('/admindata');
                }
              }, 500);
            }}
            disabled={isSaving}
            className={styles.submitBtn}
            style={{ marginLeft: '10px' }}
          >
            <svg className={styles.submitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isSaving ? 'Saving...' : 'Save & Return to List'}
          </button>
        </div>
      </form>

      {/* Custom Dialog */}
      {dialog.isOpen && (
        <div className={styles.dialogOverlay}>
          <div className={`${styles.dialogBox} ${styles[dialog.type]}`}>
            <div className={styles.dialogHeader}>
              <div className={styles.dialogIcon}>
                {dialog.type === 'success' && (
                  <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {dialog.type === 'error' && (
                  <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {dialog.type === 'confirm' && (
                  <svg className={styles.confirmIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className={styles.dialogTitle}>{dialog.title}</h3>
            </div>
            
            <div className={styles.dialogContent}>
              <p className={styles.dialogMessage}>{dialog.message}</p>
            </div>
            
            <div className={styles.dialogActions}>
              {dialog.type === 'confirm' ? (
                <>
                  <button 
                    onClick={() => {
                      dialog.onCancel?.();
                      setDialog(prev => ({ ...prev, isOpen: false }));
                    }}
                    className={styles.dialogCancelBtn}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      dialog.onConfirm?.();
                      setDialog(prev => ({ ...prev, isOpen: false }));
                    }}
                    className={styles.dialogConfirmBtn}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    dialog.onConfirm?.();
                    setDialog(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={styles.dialogOkBtn}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper: Convert Dropbox share link to direct image link
function convertDropboxUrl(url: string): string {
  if (!url) {
    return '';
  }
  // Dropbox share: https://www.dropbox.com/scl/fi/.../file.jpg?rlkey=...&st=...&dl=0
  // Direct: https://dl.dropboxusercontent.com/scl/fi/.../file.jpg?rlkey=...&raw=1
  if (url.includes('dropbox.com')) {
    let directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    // Remove dl=0 and st parameters, add raw=1
    directUrl = directUrl.replace(/[?&]dl=0/g, '');
    directUrl = directUrl.replace(/&st=[^&]*/g, '');
    // Add raw=1 parameter
    if (directUrl.includes('?')) {
      directUrl += '&raw=1';
    } else {
      directUrl += '?raw=1';
    }
    return directUrl;
  }
  return url;
}