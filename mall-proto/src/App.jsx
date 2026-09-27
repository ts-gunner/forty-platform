import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import SupplierList from './pages/SupplierList'
import SupplierDetail from './pages/SupplierDetail'
import ApplySupplier from './pages/ApplySupplier'
import Profile from './pages/Profile'
import TabBar, { tabRoutes } from './components/TabBar'

function App() {
  const location = useLocation()
  // Show TabBar only on main tab routes
  const showTabBar = tabRoutes.some((route) =>
    route === '/' ? location.pathname === '/' : location.pathname.startsWith(route)
  )

  return (
    <div className="app-container">
      <div className={`page-content ${!showTabBar ? 'page-content--no-tabbar' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/supplier/:id" element={<SupplierDetail />} />
          <Route path="/apply" element={<ApplySupplier />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showTabBar && <TabBar />}
    </div>
  )
}

export default App