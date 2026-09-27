import { useNavigate } from 'react-router-dom'
import './Profile.css'

const menuItems = [
  {
    id: 'inquiries',
    label: 'My Inquiries',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'My Favorites',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'apply',
    label: 'Become a Supplier',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

function Profile() {
  const navigate = useNavigate()

  const handleMenuClick = (id) => {
    if (id === 'apply') navigate('/apply')
  }

  return (
    <div className="profile">
      {/* ====== User Header ====== */}
      <div className="profile__header">
        <div className="profile__header-glow" />
        <div className="profile__avatar-wrap">
          <img
            src="https://picsum.photos/seed/user-avatar/100/100"
            alt="User"
            className="profile__avatar"
          />
          <div className="profile__user-info">
            <span className="profile__name">Alex Chen</span>
            <span className="profile__email">alex.chen@email.com</span>
            <div className="profile__badge">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="#00E5FF">
                <path d="M12 2l2.4 1.8 3 .2.6 2.9 2 2.2-1.4 2.7.9 3-2.8 1.2L16 19l-3-.5L10 19l-2.3-1.7-2.8-1.2.9-3L4.4 9.6l2-2.2.6-2.9 3-.2L12 2z" />
              </svg>
              <span>Premium Buyer</span>
            </div>
          </div>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="profile__edit-icon">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ====== Stats ====== */}
      <div className="profile__stats glass-card">
        <div className="profile__stat-item">
          <span className="profile__stat-num">12</span>
          <span className="profile__stat-label">Inquiries</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat-item">
          <span className="profile__stat-num">8</span>
          <span className="profile__stat-label">Favorites</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat-item">
          <span className="profile__stat-num">3</span>
          <span className="profile__stat-label">Orders</span>
        </div>
      </div>

      {/* ====== Quick Actions ====== */}
      <div className="profile__quick">
        <div className="profile__quick-item glass-card" onClick={() => navigate('/products')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>My Inquiries</span>
        </div>
        <div className="profile__quick-item glass-card" onClick={() => navigate('/products')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Favorites</span>
        </div>
      </div>

      {/* ====== Menu List ====== */}
      <div className="profile__menu glass-card">
        {menuItems.map((item, i) => (
          <div
            key={item.id}
            className="profile__menu-item tech-transition"
            onClick={() => handleMenuClick(item.id)}
          >
            <span className="profile__menu-icon">{item.icon}</span>
            <span className="profile__menu-label">{item.label}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="profile__menu-arrow">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        ))}
      </div>

      {/* ====== Footer ====== */}
      <div className="profile__footer">
        <p>MediaGear · v1.0.0</p>
        <p className="profile__logout">Log Out</p>
      </div>
    </div>
  )
}

export default Profile