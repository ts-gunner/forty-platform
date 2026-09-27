import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product, layout = 'grid' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/detail/${product.id}`)
  }

  const currency = product.currency || '$'

  if (layout === 'list') {
    return (
      <div className="product-card product-card--list tech-transition" onClick={handleClick}>
        <div className="product-card__img-wrap">
          <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
          {product.tag && <span className="product-card__tag">{product.tag}</span>}
        </div>
        <div className="product-card__info">
          <h3 className="product-card__name text-ellipsis-2">{product.name}</h3>
          <div className="product-card__meta">
            <span className="product-card__rating">★ {product.rating}</span>
            <span className="product-card__sales">{product.sales > 999 ? `${(product.sales / 1000).toFixed(1)}k` : product.sales} sold</span>
          </div>
          <div className="product-card__bottom">
            <div className="product-card__price-wrap">
              <span className="product-card__currency">{currency}</span>
              <span className="product-card__price">{product.price}</span>
              {product.originalPrice && (
                <span className="product-card__original">{currency}{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default grid layout
  return (
    <div className="product-card tech-transition" onClick={handleClick}>
      <div className="product-card__img-wrap">
        <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
        {product.tag && (
          <span className="product-card__tag">{product.tag}</span>
        )}
        <div className="product-card__img-glow" />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name text-ellipsis-2">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__rating">★ {product.rating}</span>
          <span className="product-card__sales">{product.sales > 999 ? `${(product.sales / 1000).toFixed(1)}k` : product.sales} sold</span>
        </div>
        <div className="product-card__price-wrap">
          <span className="product-card__currency">{currency}</span>
          <span className="product-card__price">{product.price}</span>
          {product.originalPrice && (
            <span className="product-card__original">{currency}{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
