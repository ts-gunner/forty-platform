import { useState } from 'react'
import { categoryList } from '../mock/data'
import './Category.css'

function Category() {
  const [activeId, setActiveId] = useState(categoryList[0].id)
  const activeCategory = categoryList.find((c) => c.id === activeId)

  return (
    <div className="category">
      {/* 搜索栏 */}
      <div className="category__search">
        <div className="category__search-box">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#999">
            <path d="M10 2a8 8 0 105.3 14l5.4 5.4a1 1 0 001.4-1.4l-5.4-5.4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg>
          <span className="category__search-placeholder">搜索分类商品</span>
        </div>
      </div>

      <div className="category__body">
        {/* 左侧分类列表 */}
        <div className="category__sidebar">
          {categoryList.map((cat) => (
            <div
              key={cat.id}
              className={`category__sidebar-item ${cat.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>

        {/* 右侧内容 */}
        <div className="category__content">
          <div className="category__banner" style={{ background: 'linear-gradient(135deg, #ff5000, #ff8a3d)' }}>
            <h3>{activeCategory.name}专区</h3>
            <p>精选好物 品质之选</p>
          </div>

          <div className="category__sub-title">热门子分类</div>
          <div className="category__grid">
            {activeCategory.children.map((sub, i) => (
              <div key={i} className="category__grid-item">
                <div
                  className="category__grid-icon"
                  style={{
                    background: `hsl(${(i * 47) % 360}, 65%, 90%)`,
                  }}
                />
                <span>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
