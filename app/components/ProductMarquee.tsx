'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '../types'

function productHref(product: Product) {
  const category = product.category_name?.toLowerCase().replace(/\s+/g, '') || 'products'
  const productId = (product.pro_id || product.id)?.toString()
  return `/${category}/${productId}`
}

export default function ProductMarquee() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        const data = await res.json()
        if (res.ok && data?.success) {
          setProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch {
        // keep silent on home
      }
    }
    run()
  }, [])

  // Cap marquee items for performance on mobile; full catalog is in /shop
  const marqueeProducts = useMemo(() => products.slice(0, 40), [products])
  const doubled = useMemo(() => [...marqueeProducts, ...marqueeProducts], [marqueeProducts])

  if (marqueeProducts.length === 0) return null

  return (
    <section className="product-marquee-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="product-marquee-title">Explore designs people love</h2>
          <p className="product-marquee-subtitle">
            Scroll-free browsing — this strip keeps moving. Tap any product to open details.
          </p>
        </motion.div>
      </div>

      <div className="product-marquee" aria-label="Product highlights">
        <div className="product-marquee-track">
          {doubled.map((p, idx) => (
            <Link key={`${p.id}-${idx}`} href={productHref(p)} className="product-marquee-item" aria-label={p.name}>
              <div className="product-marquee-thumb">
                <Image
                  src={p.main_image_url || p.image_url || '/file.svg'}
                  alt={p.name}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 14 }}>
        <Link href="/shop" className="btn btn-primary">Shop all products</Link>
      </div>
    </section>
  )
}
