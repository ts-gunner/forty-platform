import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, getSupplierById, productGallery, productContentBlocks, products } from '../mock/data'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id) || products[0]
  const supplier = getSupplierById(product.supplierId)

  const [galleryIndex, setGalleryIndex] = useState(0)
  const currentMedia = productGallery[galleryIndex] || productGallery[0]
  const currency = product.currency || '$'

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  return (
    <div className="detail">
      {/* ====== Fixed Top Nav ====== */}
      <div className="detail__nav">
        <div className="detail__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path d="M15.5 4l-8 8 8 8 1.4-1.4L10.3 12l6.6-6.6z" />
          </svg>
        </div>
        <div className="detail__nav-share">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" opacity="0.7">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" stroke="#fff" strokeWidth="1.5" />
            <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* ====== Image / Video Gallery ====== */}
      <div className="detail__gallery">
        {currentMedia.type === 'video' ? (
          <div className="detail__video-wrap">
            <img src={currentMedia.poster} alt="Video poster" className="detail__video-poster" />
            <div className="detail__video-play">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="detail__video-badge">VIDEO</span>
          </div>
        ) : (
          <img src={currentMedia.src} alt={product.name} className="detail__gallery-img" />
        )}

        {/* Thumbnails */}
        <div className="detail__thumbs">
          {productGallery.map((item, i) => (
            <div
              key={i}
              className={`detail__thumb ${i === galleryIndex ? 'active' : ''}`}
              onClick={() => setGalleryIndex(i)}
            >
              <img src={item.thumb} alt={`thumb ${i + 1}`} />
              {item.type === 'video' && <span className="detail__thumb-video-badge">▶</span>}
            </div>
          ))}
        </div>

        {/* Gallery dots */}
        <div className="detail__gallery-count">
          {galleryIndex + 1} / {productGallery.length}
        </div>
      </div>

      {/* ====== Product Info Card ====== */}
      <div className="detail__info-card glass-card">
        <div className="detail__price-row">
          <div className="detail__price-wrap">
            <span className="detail__currency">{currency}</span>
            <span className="detail__price">{product.price}</span>
            {product.originalPrice && (
              <span className="detail__original">{currency}{product.originalPrice}</span>
            )}
          </div>
          <span className="detail__discount">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        </div>

        <h1 className="detail__name">{product.name}</h1>
        <p className="detail__desc">{product.desc}</p>

        <div className="detail__info-meta">
          <span className="detail__meta-item">★ {product.rating}</span>
          <span className="detail__meta-divider">·</span>
          <span className="detail__meta-item">{product.sales > 999 ? `${(product.sales / 1000).toFixed(1)}k` : product.sales} sold</span>
          <span className="detail__meta-divider">·</span>
          <span className="detail__meta-item">In Stock</span>
        </div>

        <div className="detail__tags">
          <span className="detail__tag">Verified</span>
          <span className="detail__tag">Warranty</span>
          <span className="detail__tag">Fast Shipping</span>
        </div>
      </div>

      {/* ====== Supplier Card ====== */}
      {supplier && (
        <div className="detail__supplier-card glass-card" onClick={() => navigate(`/supplier/${supplier.id}`)}>
          <img src={supplier.avatar} alt={supplier.name} className="detail__supplier-avatar" />
          <div className="detail__supplier-info">
            <div className="detail__supplier-name-wrap">
              <span className="detail__supplier-name">{supplier.name}</span>
              {supplier.verified && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#00E5FF">
                  <path d="M12 2l2.4 1.8 3 .2.6 2.9 2 2.2-1.4 2.7.9 3-2.8 1.2L16 19l-3-.5L10 19l-2.3-1.7-2.8-1.2.9-3L4.4 9.6l2-2.2.6-2.9 3-.2L12 2zm-1 13l5-5-1.4-1.4L11 12l-2-2-1.4 1.4L11 15z" />
                </svg>
              )}
            </div>
            <p className="detail__supplier-location">{supplier.location}</p>
            <p className="detail__supplier-meta">
              {supplier.yearsOnPlatform} yrs · ★ {supplier.rating}
            </p>
          </div>
          <div className="detail__supplier-arrow">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      )}

      {/* ====== Rich Content Section ====== */}
      <div className="detail__content-section">
        <div className="detail__content-header">
          <h3 className="detail__content-title">Product Details</h3>
        </div>
        <div className="detail__content-body">
          {productContentBlocks.map((block, i) => {
            if (block.type === 'heading') {
              return (
                <h4 key={i} className="detail__content-heading">{block.text}</h4>
              )
            }
            if (block.type === 'text') {
              return (
                <p key={i} className="detail__content-text">{block.text}</p>
              )
            }
            if (block.type === 'image') {
              return (
                <div key={i} className="detail__content-img-wrap">
                  <img src={block.src} alt={`content ${i}`} className="detail__content-img" loading="lazy" />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* ====== Related Products ====== */}
      {relatedProducts.length > 0 && (
        <div className="detail__related-section">
          <div className="detail__content-header">
            <h3 className="detail__content-title">You May Also Like</h3>
          </div>
          <div className="detail__related-grid">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="detail__related-item tech-transition"
                onClick={() => {
                  setGalleryIndex(0)
                  navigate(`/detail/${rp.id}`)
                  window.scrollTo(0, 0)
                }}
              >
                <img src={rp.image} alt={rp.name} className="detail__related-img" loading="lazy" />
                <span className="detail__related-name text-ellipsis-2">{rp.name}</span>
                <span className="detail__related-price">{currency}{rp.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacer for bottom bar */}
      <div className="detail__bottom-spacer" />

      {/* ====== Bottom Action Bar ====== */}
      <div className="detail__action-bar">
        <div className="detail__action-icons">
          <div className="detail__action-icon" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#6B7280">
              <path d="M12 3l9 8h-2.5v9h-5v-5.5h-3V20h-5v-9H3l9-8z" />
            </svg>
            <span>Home</span>
          </div>
        </div>
        <button className="detail__btn detail__btn--inquire" onClick={() => alert('Prototype: Open inquiry form')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Inquire
        </button>
        <button className="detail__btn detail__btn--contact" onClick={() => alert('Prototype: Contact supplier')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Contact Supplier
        </button>
      </div>
    </div>
  )
}

export default ProductDetail
