'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../AdminData.module.css'

export default function NewCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category_name: '',
    arrange_order: 0
  })
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

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admindata')
        return
      }
    }
  }, [router])

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

      console.log('Creating category:', formData);

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Category created successfully!',
          onConfirm: () => {
            setDialog(prev => ({ ...prev, isOpen: false }));
            router.push('/admindata');
          }
        });
      } else {
        const error = await response.json()
        console.error('Save failed:', error);
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Save Failed',
          message: `Failed to create category: ${error.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error creating category:', error)
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to create category. Please try again.'
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
          ➕ Add New Category
        </h1>
      </div>

      {/* Create Form */}
      <form onSubmit={handleSave} className={styles.editForm}>
        <div className={styles.formSections}>
          
          {/* Category Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>📂 Category Information</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Category Name *</label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                  className={styles.input}
                  placeholder="Enter category name (e.g., Engagement Rings, Wedding Platters)"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Sort Order (Homepage) *</label>
                <input
                  type="number"
                  value={formData.arrange_order}
                  onChange={(e) => setFormData({ ...formData, arrange_order: Number(e.target.value) })}
                  className={styles.input}
                  min={0}
                  step={1}
                  required
                />
                <small className={styles.helpText}>
                  Lower number shows first on the homepage.
                </small>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <label className={styles.label}>Category Description (Optional)</label>
                <textarea
                  placeholder="Enter a brief description of this category..."
                  className={styles.textarea}
                  rows={4}
                />
                <small className={styles.helpText}>
                  This description can be used for SEO and category pages in the future.
                </small>
              </div>
            </div>

            {/* Category Guidelines */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
                <div className={styles.infoBox}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#800020' }}>📋 Category Naming Guidelines</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
                    <li>Use clear, descriptive names (e.g., &quot;Engagement Rings&quot;, not &quot;Type1&quot;)</li>
                    <li>Keep names concise but meaningful</li>
                    <li>Use proper capitalization (Title Case)</li>
                    <li>Avoid special characters and numbers unless necessary</li>
                    <li>Consider how customers will search for these products</li>
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
                {isSaving ? 'Creating...' : 'Create Category'}
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
            {isSaving ? 'Creating...' : 'Create Category'}
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