import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, sortProducts } from '../mock/data'
import './ProductList.css'

const filterTabs = [
  { id: 'all', name: 'All' },
  { id: 'audio', name: 'Audio' },
  { id: 'mic', name: 'Mics' },
  { id: 'lighting', name: 'Lighting' },
]

const sortOptions = [
  { id: 'default', name: 'Default' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'newest', name: 'Newest' },
  { id: 'sales', name: 'Best Selling' },
]

function ProductList() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const list =
      activeCategory === 'all'
        ? products
        : products.filter((p) => p.category === activeCategory)
    return sortProducts(list, sortBy)
  }, [activeCategory, sortBy])

  return (
    <div className="product-list">
      {/* ====== Header ====== */}
      <div className="product-list__header">
        <h1 className="product-list__title">Products</h1>
        <div className="product-list__search glass-card">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="product-list__search-placeholder">Search products...</span>
        </div>
      </div>

      {/* ====== Category Tabs ====== */}
      <div className="product-list__tabs">
        <div className="product-list__tabs-scroll">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`product-list__tab ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="product-list__sort-wrap">
          <button
            className={`product-list__sort-btn ${sortOpen ? 'open' : ''}`}
            onClick={() => setSortOpen(!sortOpen)}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
            Sort
          </button>
          {sortOpen && (
            <>
              <div className="product-list__sort-overlay" onClick={() => setSortOpen(false)} />
              <div className="product-list__sort-dropdown glass-card">
                {sortOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`product-list__sort-item ${sortBy === opt.id ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy(opt.id)
                      setSortOpen(false)
                    }}
                  >
                    {opt.name}
                    {sortBy === opt.id && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#00E5FF">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ====== Result Count ====== */}
      <div className="product-list__count">
        <span>{filteredProducts.length} products found</span>
      </div>

      {/* ====== Product Grid ====== */}
      <div className="product-list__grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="product-list__empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="#6B7280" opacity="0.3">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" />
          </svg>
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default ProductList