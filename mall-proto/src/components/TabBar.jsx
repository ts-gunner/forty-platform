import { useLocation, useNavigate } from 'react-router-dom'
import './TabBar.css'

const tabs = [
  {
    path: '/',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill={active ? '#00E5FF' : '#6B7280'}>
        <path d="M12 3l9 8h-2.5v9h-5v-5.5h-3V20h-5v-9H3l9-8z" />
      </svg>
    ),
  },
  {
    path: '/products',
    label: 'Products',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={active ? '#00E5FF' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: '/suppliers',
    label: 'Suppliers',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={active ? '#00E5FF' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 13h.01M9 17h.01" />
      </svg>
    ),
  },
  {
    path: '/apply',
    label: 'Apply',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={active ? '#00E5FF' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill={active ? '#00E5FF' : '#6B7280'}>
        <circle cx="12" cy="8" r="4.5" />
        <path d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z" />
      </svg>
    ),
  },
]

// Routes where TabBar should be visible
const tabRoutes = ['/', '/products', '/suppliers', '/apply', '/profile']

function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="tabbar">
      {tabs.map((tab) => {
        const active = isActive(tab.path)
        return (
          <div
            key={tab.path}
            className={`tabbar-item ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tabbar-icon">{tab.icon(active)}</span>
            <span className="tabbar-label">{tab.label}</span>
            {active && <span className="tabbar-indicator" />}
          </div>
        )
      })}
    </nav>
  )
}

export default TabBar
export { tabRoutes }