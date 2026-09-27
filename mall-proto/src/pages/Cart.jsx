import { useState } from 'react'
import { products } from '../mock/data'
import './Cart.css'

function Cart() {
  // 用 mock 数据初始化购物车
  const [cartItems, setCartItems] = useState(
    products.slice(0, 3).map((p) => ({
      ...p,
      quantity: 1,
      checked: true,
    }))
  )
  const [allChecked, setAllChecked] = useState(true)

  const toggleItem = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const changeQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const toggleAll = () => {
    const newVal = !allChecked
    setAllChecked(newVal)
    setCartItems((items) =>
      items.map((item) => ({ ...item, checked: newVal }))
    )
  }

  const checkedItems = cartItems.filter((i) => i.checked)
  const totalPrice = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalCount = checkedItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="cart">
      {/* 标题栏 */}
      <div className="cart__header">
        <h2>购物车</h2>
        <span className="cart__edit">管理</span>
      </div>

      {/* 购物车列表 */}
      <div className="cart__list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart__item">
            <div
              className={`cart__check ${item.checked ? 'checked' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              {item.checked && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
                  <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" />
                </svg>
              )}
            </div>
            <div
              className="cart__item-img"
              style={{ background: item.gradient }}
            />
            <div className="cart__item-info">
              <div className="cart__item-name text-ellipsis-2">{item.name}</div>
              <div className="cart__item-spec">默认规格</div>
              <div className="cart__item-bottom">
                <span className="cart__item-price price">{item.price}</span>
                <div className="cart__stepper">
                  <button
                    className="cart__stepper-btn"
                    onClick={() => changeQuantity(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="cart__stepper-num">{item.quantity}</span>
                  <button
                    className="cart__stepper-btn"
                    onClick={() => changeQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部结算栏 */}
      <div className="cart__footer">
        <div
          className={`cart__check cart__check--all ${allChecked ? 'checked' : ''}`}
          onClick={toggleAll}
        >
          {allChecked && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
              <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" />
            </svg>
          )}
          <span className="cart__check-all-label">全选</span>
        </div>
        <div className="cart__total">
          <span>合计：</span>
          <span className="cart__total-price price">{totalPrice.toFixed(2)}</span>
        </div>
        <button className="cart__settle-btn">
          结算{totalCount > 0 ? `(${totalCount})` : ''}
        </button>
      </div>
    </div>
  )
}

export default Cart
