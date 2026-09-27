import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { banners, categories, products } from '../mock/data'
import './Home.css'

// Category icon SVG renderer
function CategoryIcon({ icon, color, size = 26 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: color, stroke: color }
  switch (icon) {
    case 'speaker':
      return (
        <svg {...props} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <circle cx="12" cy="9" r="3" />
          <circle cx="12" cy="16" r="1.5" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...props} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="17" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )
    case 'light':
      return (
        <svg {...props} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2h6v5a3 3 0 0 1-6 0V2z" />
          <path d="M9 4H5v3a4 4 0 0 0 4 4" />
          <path d="M15 4h4v3a4 4 0 0 1-4 4" />
          <line x1="12" y1="10" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )
    case 'grid':
    default:
      return (
        <svg {...props} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
  }
}

function Home() {
  const navigate = useNavigate()
  const [bannerIndex, setBannerIndex] = useState(0)

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleCategoryClick = (catId) => {
    navigate(`/products${catId !== 'all' ? `?cat=${catId}` : ''}`)
  }

  const handleSearch = () => {
    navigate('/products')
  }

  return (
    <div className="home">
      {/* ====== Search Bar ====== */}
      <div className="home__search">
        <div className="home__search-logo">
          <span className="home__logo-text">MEDIAGEAR</span>
        </div>
        <div className="home__search-box glass-card" onClick={handleSearch}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="home__search-placeholder">Search audio, mics, lighting...</span>
        </div>
      </div>

      {/* ====== Banner Carousel ====== */}
      <div className="home__banner">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`home__banner-item ${i === bannerIndex ? 'active' : ''}`}
          >
            <img src={banner.image} alt={banner.title} className="home__banner-img" />
            <div className="home__banner-overlay" style={{ background: banner.gradient }} />
            <div className="home__banner-text">
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
              <span className="home__banner-cta">Shop Now →</span>
            </div>
          </div>
        ))}
        <div className="home__banner-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`home__banner-dot ${i === bannerIndex ? 'active' : ''}`}
              onClick={() => setBannerIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* ====== Category Grid ====== */}
      <div className="home__section">
        <div className="home__section-header">
          <h3 className="home__section-title">Browse by Category</h3>
        </div>
        <div className="home__category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="home__category-item tech-transition"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="home__category-icon" style={{ borderColor: cat.color + '30' }}>
                <CategoryIcon icon={cat.icon} color={cat.color} />
                <div className="home__category-glow" style={{ background: cat.color }} />
              </div>
              <span className="home__category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Recommended Products ====== */}
      <div className="home__section">
        <div className="home__section-header">
          <h3 className="home__section-title">Featured Products</h3>
          <span className="home__section-more" onClick={() => navigate('/products')}>See All</span>
        </div>
        <div className="home__products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="home__footer">
        <p>MediaGear · Pro Audio & Stage Equipment Marketplace</p>
      </div>
    </div>
  )
}

export default Home
