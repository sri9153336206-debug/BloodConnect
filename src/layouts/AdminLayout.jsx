import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Droplets, LayoutDashboard, Users, Handshake, LogOut, X, Menu, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useAuth }  from '../context/AuthContext.jsx'
import { useUI }    from '../context/UIContext.jsx'

const ADMIN_NAV = [
  { label: 'Dashboard',      path: '/admin',         icon: <LayoutDashboard size={18} /> },
  { label: 'Manage Donors',  path: '/admin/donors',  icon: <Handshake       size={18} /> },
  { label: 'Manage Users',   path: '/admin/users',   icon: <Users           size={18} /> },
  { label: 'Manage Queries', path: '/admin/queries', icon: <MessageSquare   size={18} /> },
]

const AdminLayout = () => {
  const navigate         = useNavigate()
  const { logout }       = useAuth()
  const { showSuccess }  = useUI()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    showSuccess('Logged out.')
    navigate('/')
  }

  const linkClass = ({ isActive }) => [
    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
    'transition-all duration-150',
    isActive
      ? 'bg-red-600 text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-red-600',
  ].join(' ')

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ─────────────────────────── */}
      <aside className={[
        'fixed inset-y-0 left-0 z-40 w-60',
        'bg-white border-r border-gray-100',
        'flex flex-col',
        'transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto',
      ].join(' ')}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <Droplets size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">BloodConnect</p>
            <p className="text-xs text-red-600 font-semibold">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Back to site + Logout */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ← Back to Site
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-bold text-gray-800">Admin Dashboard</h1>
          <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full">
            Admin
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout