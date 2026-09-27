import { useNavigate, useParams } from 'react-router-dom'
import { getSupplierById, getProductsBySupplier } from '../mock/data'
import './SupplierDetail.css'

function SupplierDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const supplier = getSupplierById(id)
  const supplierProducts = supplier ? getProductsBySupplier(supplier.id) : []

  if (!supplier) {
    return (
      <div className="supplier-detail__error">
        <p>Supplier not found.</p>
        <button onClick={() => navigate('/suppliers')}>Back to Suppliers</button>
      </div>
    )
  }

  return (
    <div className="supplier-detail">
      {/* ====== Fixed Top Nav ====== */}
      <div className="supplier-detail__nav">
        <div className="supplier-detail__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path d="M15.5 4l-8 8 8 8 1.4-1.4L10.3 12l6.6-6.6z" />
          </svg>
        </div>
      </div>

      {/* ====== Cover Image ====== */}
      <div className="supplier-detail__cover">
        <img src={supplier.cover} alt={supplier.name} className="supplier-detail__cover-img" />
        <div className="supplier-detail__cover-overlay" />
      </div>

      {/* ====== Supplier Info ====== */}
      <div className="supplier-detail__info-card glass-card">
        <div className="supplier-detail__info-top">
          <img src={supplier.avatar} alt={supplier.name} className="supplier-detail__avatar" />
          <div className="supplier-detail__info-main">
            <div className="supplier-detail__name-row">
              <h2 className="supplier-detail__name">{supplier.name}</h2>
              {supplier.verified && (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="#00E5FF" className="supplier-detail__verified">
                  <path d="M12 2l2.4 1.8 3 .2.6 2.9 2 2.2-1.4 2.7.9 3-2.8 1.2L16 19l-3-.5L10 19l-2.3-1.7-2.8-1.2.9-3L4.4 9.6l2-2.2.6-2.9 3-.2L12 2zm-1 13l5-5-1.4-1.4L11 12l-2-2-1.4 1.4L11 15z" />
                </svg>
              )}
            </div>
            <span className="supplier-detail__location">{supplier.location}</span>
            <div className="supplier-detail__stats">
              <span className="supplier-detail__stat">★ {supplier.rating}</span>
              <span className="supplier-detail__stat-sep">·</span>
              <span className="supplier-detail__stat">{supplier.yearsOnPlatform} yrs</span>
              <span className="supplier-detail__stat-sep">·</span>
              <span className="supplier-detail__stat">{supplierProducts.length} products</span>
            </div>
          </div>
        </div>

        <p className="supplier-detail__main-products">
          <span className="supplier-detail__label">Main Products: </span>
          {supplier.mainProducts}
        </p>
        <p className="supplier-detail__description">{supplier.description}</p>
      </div>

      {/* ====== Contact Card ====== */}
      <div className="supplier-detail__contact-section">
        <div className="supplier-detail__section-header">
          <h3 className="supplier-detail__section-title">Contact</h3>
        </div>
        <div className="supplier-detail__contact-list glass-card">
          <div className="supplier-detail__contact-item">
            <div className="supplier-detail__contact-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
            </div>
            <div className="supplier-detail__contact-info">
              <span className="supplier-detail__contact-label">Phone</span>
              <span className="supplier-detail__contact-value">{supplier.contacts.phone}</span>
            </div>
          </div>

          <div className="supplier-detail__contact-item">
            <div className="supplier-detail__contact-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="supplier-detail__contact-info">
              <span className="supplier-detail__contact-label">Email</span>
              <span className="supplier-detail__contact-value">{supplier.contacts.email}</span>
            </div>
          </div>

          <div className="supplier-detail__contact-item">
            <div className="supplier-detail__contact-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.174.248-.372.173-.521z" />
              </svg>
            </div>
            <div className="supplier-detail__contact-info">
              <span className="supplier-detail__contact-label">WhatsApp</span>
              <span className="supplier-detail__contact-value">{supplier.contacts.whatsapp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Products Section ====== */}
      <div className="supplier-detail__products-section">
        <div className="supplier-detail__section-header">
          <h3 className="supplier-detail__section-title">Products</h3>
          <span className="supplier-detail__product-count">{supplierProducts.length} items</span>
        </div>
        <div className="supplier-detail__products-grid">
          {supplierProducts.map((product) => (
            <div
              key={product.id}
              className="supplier-detail__product-item tech-transition"
              onClick={() => navigate(`/detail/${product.id}`)}
            >
              <img src={product.image} alt={product.name} className="supplier-detail__product-img" loading="lazy" />
              <span className="supplier-detail__product-name text-ellipsis-2">{product.name}</span>
              <span className="supplier-detail__product-price">{product.currency}{product.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default SupplierDetail