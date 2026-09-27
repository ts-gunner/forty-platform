import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { suppliers, getSuppliersByCategory } from '../mock/data'
import './SupplierList.css'

const filterTabs = [
  { id: 'all', name: 'All' },
  { id: 'audio', name: 'Audio' },
  { id: 'mic', name: 'Mics' },
  { id: 'lighting', name: 'Lighting' },
]

function SupplierList() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchText, setSearchText] = useState('')

  const filteredSuppliers = useMemo(() => {
    let list = getSuppliersByCategory(activeCategory)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.mainProducts.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, searchText])

  return (
    <div className="supplier-list">
      {/* ====== Header ====== */}
      <div className="supplier-list__header">
        <h1 className="supplier-list__title">Suppliers</h1>
        <div className="supplier-list__search-wrap">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="supplier-list__search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="supplier-list__search-input"
            placeholder="Search suppliers..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* ====== Category Tabs ====== */}
      <div className="supplier-list__tabs">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`supplier-list__tab ${activeCategory === tab.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* ====== Result Count ====== */}
      <div className="supplier-list__count">
        <span>{filteredSuppliers.length} suppliers</span>
      </div>

      {/* ====== Supplier Cards ====== */}
      <div className="supplier-list__grid">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="supplier-list__card glass-card tech-transition"
            onClick={() => navigate(`/supplier/${supplier.id}`)}
          >
            <div className="supplier-list__card-top">
              <img src={supplier.avatar} alt={supplier.name} className="supplier-list__avatar" />
              <div className="supplier-list__card-info">
                <div className="supplier-list__name-row">
                  <span className="supplier-list__name">{supplier.name}</span>
                  {supplier.verified && (
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#00E5FF" className="supplier-list__verified">
                      <path d="M12 2l2.4 1.8 3 .2.6 2.9 2 2.2-1.4 2.7.9 3-2.8 1.2L16 19l-3-.5L10 19l-2.3-1.7-2.8-1.2.9-3L4.4 9.6l2-2.2.6-2.9 3-.2L12 2zm-1 13l5-5-1.4-1.4L11 12l-2-2-1.4 1.4L11 15z" />
                    </svg>
                  )}
                </div>
                <span className="supplier-list__location">{supplier.location}</span>
              </div>
            </div>
            <p className="supplier-list__main-products">{supplier.mainProducts}</p>
            <div className="supplier-list__card-footer">
              <span className="supplier-list__rating">★ {supplier.rating}</span>
              <span className="supplier-list__years">{supplier.yearsOnPlatform} yrs</span>
              <span className="supplier-list__product-count">{supplier.productCount} products</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredSuppliers.length === 0 && (
        <div className="supplier-list__empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="#6B7280" opacity="0.3">
            <path d="M12 7c-2.76 0-5 2.24-5 5 0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
          <p>No suppliers found.</p>
        </div>
      )}
    </div>
  )
}

export default SupplierList