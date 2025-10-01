'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../AdminData.module.css'

interface Category {
  category_id: number
  category_name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    model_name: '',
    category_id: '',
    main_image_url: '',
    original_price: '',
    cut_price: ''
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [isSaving, setIsSaving] = useState(false)
  
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

  // Check authentication and load categories
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admindata')
        return
      }
      loadCategories()
    }
  }, [router])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
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
          message: 'Model Name is required'
        });
        setIsSaving(false);
        return;
      }

      if (!formData.category_id) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Category is required'
        });
        setIsSaving(false);
        return;
      }

      if (!formData.main_image_url?.trim()) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Main Image URL is required'
        });
        setIsSaving(false);
        return;
      }

      if (!formData.original_price || parseFloat(formData.original_price) <= 0) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Original Price is required and must be greater than 0'
        });
        setIsSaving(false);
        return;
      }

      console.log('Creating product:', formData);

      // Prepare data for API
      const productPayload = {
        model_name: formData.model_name,
        category_id: parseInt(formData.category_id),
        main_image_url: formData.main_image_url,
        original_price: parseFloat(formData.original_price),
        cut_price: formData.cut_price ? parseFloat(formData.cut_price) : undefined
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      })

      const responseData = await response.json()

      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Product created successfully!',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            router.push('/admindata');
          }
        });
      } else {
        console.error('Save failed:', responseData);
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Save Failed',
          message: `Failed to create product: ${responseData.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to create product. Please try again.'
      });
    } finally {
      setIsSaving(false)
    }
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
          ➕ Add New Product
        </h1>
      </div>

      {/* Create Form */}
      <form onSubmit={handleSave} className={styles.editForm}>
        <div className={styles.formSections}>
          
          {/* Product Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📦 Product Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <label className={styles.label}>
                  Model Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.model_name}
                  onChange={(e) => setFormData({...formData, model_name: e.target.value})}
                  className={styles.input}
                  placeholder="Enter product model name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Category <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className={styles.select}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>
                  Main Image URL <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="url"
                  value={formData.main_image_url}
                  onChange={(e) => setFormData({...formData, main_image_url: e.target.value})}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <small className={styles.helpText}>
                  Enter a valid image URL (must start with http:// or https://)
                </small>
              </div>
            </div>

            {/* Image Preview */}
            {formData.main_image_url && (
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                  <label className={styles.label}>Image Preview</label>
                  <div style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    textAlign: 'center'
                  }}>
                    <img 
                      src={formData.main_image_url} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '300px', 
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Section */}
            <h4 style={{ margin: '2rem 0 1rem 0', color: '#800020', fontSize: '1.1rem' }}>
              💰 Pricing Information
            </h4>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Original Price (₹) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                  className={styles.input}
                  placeholder="2999.00"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cut Price (₹) <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>(Optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cut_price}
                  onChange={(e) => setFormData({...formData, cut_price: e.target.value})}
                  className={styles.input}
                  placeholder="1999.00"
                />
                <small className={styles.helpText}>
                  Leave empty if no discount
                </small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount</label>
                <div className={styles.infoBox} style={{ padding: '0.75rem', margin: 0 }}>
                  {formData.original_price && formData.cut_price ? (
                    <>
                      <strong style={{ color: '#16a34a', fontSize: '1.2rem' }}>
                        {Math.round((1 - parseFloat(formData.cut_price) / parseFloat(formData.original_price)) * 100)}% OFF
                      </strong>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Save ₹{(parseFloat(formData.original_price) - parseFloat(formData.cut_price)).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>No discount</span>
                  )}
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <div className={styles.infoBox}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#800020' }}>📋 Product Creation Guidelines</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
                    <li><strong>Model Name:</strong> Use clear, descriptive names (e.g., &quot;Royal Gold Engagement Ring Platter&quot;)</li>
                    <li><strong>Category:</strong> Select the appropriate category for better organization</li>
                    <li><strong>Image URL:</strong> Use high-quality product images (minimum 800x800px recommended)</li>
                    <li><strong>Pricing:</strong> Original price is mandatory. Add cut price only if offering a discount</li>
                    <li><strong>URL Format:</strong> Images must be hosted online (e.g., Cloudinary, Firebase, S3)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section Update Button */}
            <div className={styles.sectionUpdateButton}>
              <button
                type="submit"
                disabled={isSaving}
                className={styles.updateSectionBtn}
              >
                {isSaving ? 'Creating...' : '✓ Create Product'}
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
            {isSaving ? 'Creating...' : 'Create Product'}
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
