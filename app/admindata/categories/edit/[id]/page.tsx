'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../AdminData.module.css'

interface Category {
  category_id: number
  category_name: string
  product_count: number
  image?: string
  kefeatures?: string

}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [formData, setFormData] = useState<Partial<Category>>({})
  const [isLoading, setIsLoading] = useState(true)
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

  const loadCategory = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`)
      if (response.ok) {
        const categoryData = await response.json()
        setFormData(categoryData)
      } else {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Category Not Found',
          message: 'The requested category could not be found.',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            router.push('/admindata');
          }
        });
      }
    } catch (error) {
      console.error('Error loading category:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Loading Error',
        message: 'An error occurred while loading the category.',
        onConfirm: () => {
          setDialog(prev => ({ ...prev, isOpen: false }));
          router.push('/admindata');
        }
      });
    } finally {
      setIsLoading(false)
    }
  }, [categoryId, router])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admindata')
      return
    }

    loadCategory()
  }, [loadCategory, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      if (!formData.category_name?.trim()) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Validation Error',
          message: 'Category name is required'
        });
        setIsSaving(false);
        return;
      }

      // Always save Dropbox image as direct link
      const imageToSave = formData.image ? convertDropboxUrl(formData.image) : '';

      // Only save key features as typed, trim whitespace
      const kefeaturesToSave = formData.kefeatures ? formData.kefeatures.trim() : '';

      const saveData = {
        ...formData,
        image: imageToSave,
        kefeatures: kefeaturesToSave
      };

      console.log('Updating category:', saveData);

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Category updated successfully!',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            router.push('/admindata');
          }
        });
      } else {
        const error = await response.json()
        console.error('Update failed:', error);
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Update Failed',
          message: `Failed to update category: ${error.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error updating category:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update category. Please try again.'
      });
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (formData.product_count && formData.product_count > 0) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Cannot Delete Category',
        message: `This category has ${formData.product_count} products. Please move or delete the products first.`
      });
      return;
    }

    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${formData.category_name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            setDialog({
              isOpen: true,
              type: 'success',
              title: 'Deleted',
              message: 'Category deleted successfully!',
              onConfirm: () => {
                setDialog(prev => ({ ...prev, isOpen: false }));
                router.push('/admindata');
              }
            });
          } else {
            const error = await response.json()
            setDialog({
              isOpen: true,
              type: 'error',
              title: 'Delete Failed',
              message: `Failed to delete category: ${error.error || 'Unknown error'}`
            });
          }
        } catch (error) {
          console.error('Error deleting category:', error)
          setDialog({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to delete category. Please try again.'
          });
        }
      }
    });
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <h2>Loading category...</h2>
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
          ✏️ Edit Category
        </h1>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className={styles.editForm}>
        <div className={styles.formSections}>
          
          {/* Category Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📂 Category Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category ID (Read-only)</label>
                <input
                  type="text"
                  value={formData.category_id || ''}
                  readOnly
                  className={`${styles.input} ${styles.readOnly}`}
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category Name *</label>
                <input
                  type="text"
                  value={formData.category_name || ''}
                  onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Product Count (Read-only)</label>
                <input
                  type="text"
                  value={`${formData.product_count || 0} products`}
                  readOnly
                  className={`${styles.input} ${styles.readOnly}`}
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Image URL Input & Preview */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Category Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={styles.input}
                  placeholder="Paste Dropbox or direct image URL"
                />
                {/* Image Preview: Convert Dropbox to direct link if needed */}
                {formData.image && (
                  <div style={{ marginTop: '1rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={convertDropboxUrl(formData.image)}
                      alt="Category Preview"
                      style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: '12px', border: '1px solid #eee' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Kefeatures Input */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Key Features</label>
                <textarea
                  value={formData.kefeatures || ''}
                  onChange={(e) => setFormData({ ...formData, kefeatures: e.target.value })}
                  className={styles.input}
                  rows={3}
                  placeholder="Enter key features, separated by commas or new lines"
                />
              </div>
            </div>


            {/* Category Guidelines */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <div className={styles.infoBox}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#800020' }}>📋 Important Notes</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
                    <li>Changing the category name will affect all products in this category</li>
                    <li>Category deletion is only allowed when there are no products</li>
                    <li>Use clear, descriptive names for better customer experience</li>
                    <li>Consider SEO impact when changing category names</li>
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
                {isSaving ? 'Updating...' : 'Update Category'}
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
            type="button"
            onClick={handleDelete}
            className={styles.deleteBtn}
            disabled={Boolean(formData.product_count && formData.product_count > 0)}
          >
            🗑️ Delete Category
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className={styles.submitBtn}
          >
            <svg className={styles.submitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isSaving ? 'Updating...' : 'Update Category'}
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
  // Dropbox share: https://www.dropbox.com/scl/fi/.../file.jpg?...&dl=0
  // Direct: https://dl.dropboxusercontent.com/scl/fi/.../file.jpg?...&dl=0
  if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '?raw=1');
  }
  return url;
}