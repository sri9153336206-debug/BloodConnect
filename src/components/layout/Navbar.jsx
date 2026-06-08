import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Droplets,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
  UserCircle,
  Settings,
  Handshake,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useUI } from '../../context/UIContext.jsx'
import { NAV_LINKS } from '../../constants/index.js'
import { CountBadge } from '../ui/Badge.jsx'
import { LogoutModal } from '../ui/Modal.jsx'

// ════════════════════════════════════════════════════
//  NAVBAR COMPONENT
// ════════════════════════════════════════════════════
const Navbar = () => {

  const navigate  = useNavigate()
  const location  = useLocation()
  const { currentUser, isLoggedIn, isDonor, isAdmin, logout, userInitial } = useAuth()
  const { favoritesCount } = useFavorites()
  const { showSuccess }    = useUI()

  // ── State ────────────────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen,    setIsProfileOpen]    = useState(false)
  const [isScrolled,       setIsScrolled]       = useState(false)
  const [showLogoutModal,  setShowLogoutModal]  = useState(false)

  // ── Refs ─────────────────────────────────────────
  const profileDropdownRef = useRef(null)
  const mobileMenuRef      = useRef(null)

  // ── Close Mobile Menu On Route Change ────────────
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  // ── Scroll Shadow ─────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Close Dropdown On Outside Click ──────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Lock Body Scroll When Mobile Menu Open ────────
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // ── Handle Logout ─────────────────────────────────
  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
    setIsProfileOpen(false)
    showSuccess('Logged out successfully!')
    navigate('/')
  }

  // ── Nav Link Classes ──────────────────────────────
  const getNavLinkClass = ({ isActive }) => [
    'relative text-sm font-medium',
    'transition-colors duration-200',
    'hover:text-red-600',
    'focus:outline-none focus:text-red-600',
    isActive
      ? 'text-red-600'
      : 'text-gray-600',
  ].join(' ')

  // ── Active Indicator ──────────────────────────────
  const ActiveDot = ({ isActive }) =>
    isActive ? (
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
    ) : null

  // ── Render ───────────────────────────────────────
  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-30',
          'bg-white border-b border-gray-100',
          'transition-shadow duration-300',
          isScrolled ? 'shadow-md' : 'shadow-none',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────── */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 group"
              aria-label="BloodConnect Home"
            >
              {/* Blood Drop Icon */}
              <div className={[
                'w-8 h-8 rounded-full',
                'bg-red-600 group-hover:bg-red-700',
                'flex items-center justify-center',
                'transition-colors duration-200',
                'animate-heartbeat',
              ].join(' ')}>
                <Droplets size={16} className="text-white" />
              </div>
              {/* App Name */}
              <span className="text-lg font-bold text-gray-900">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ─────────────── */}
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={getNavLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <ActiveDot isActive={isActive} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── Desktop Right Actions ─────────── */}
            <div className="hidden md:flex items-center gap-3">

              {isLoggedIn ? (
                <>
                  {/* Favorites Link */}
                  <Link
                    to="/favorites"
                    className={[
                      'relative flex items-center justify-center',
                      'w-9 h-9 rounded-full',
                      'text-gray-500 hover:text-red-600',
                      'hover:bg-red-50',
                      'transition-colors duration-200',
                    ].join(' ')}
                    aria-label={`Favorites ${favoritesCount > 0 ? `(${favoritesCount})` : ''}`}
                  >
                    <Heart size={18} />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5">
                        <CountBadge count={favoritesCount} />
                      </span>
                    )}
                  </Link>

                  {/* Profile Dropdown */}
                  <div
                    ref={profileDropdownRef}
                    className="relative"
                  >
                    {/* Avatar Button */}
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(prev => !prev)}
                      className={[
                        'flex items-center gap-2',
                        'pl-1 pr-3 py-1',
                        'rounded-full border border-gray-200',
                        'hover:border-red-300 hover:bg-red-50',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-red-500',
                      ].join(' ')}
                      aria-expanded={isProfileOpen}
                      aria-haspopup="true"
                      aria-label="Profile menu"
                    >
                      {/* Avatar Circle */}
                      <div className={[
                        'w-7 h-7 rounded-full',
                        'bg-red-600 text-white',
                        'flex items-center justify-center',
                        'text-xs font-bold flex-shrink-0',
                      ].join(' ')}>
                        {userInitial}
                      </div>
                      {/* Name */}
                      <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                        {currentUser?.name?.split(' ')[0]}
                      </span>
                      {/* Chevron */}
                      <ChevronDown
                        size={14}
                        className={[
                          'text-gray-400 transition-transform duration-200',
                          isProfileOpen ? 'rotate-180' : '',
                        ].join(' ')}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className={[
                        'absolute right-0 top-full mt-2',
                        'w-56 bg-white',
                        'rounded-2xl shadow-xl',
                        'border border-gray-100',
                        'py-2 z-50',
                        'animate-scale-in',
                      ].join(' ')}>

                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {currentUser?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {currentUser?.email}
                          </p>
                          {isDonor && (
                            <span className={[
                              'inline-flex items-center gap-1 mt-1.5',
                              'px-2 py-0.5 rounded-full',
                              'bg-red-100 text-red-700',
                              'text-xs font-semibold',
                            ].join(' ')}>
                              <Droplets size={10} />
                              Donor
                            </span>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <DropdownItem
                            icon={<UserCircle size={16} />}
                            label="My Profile"
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <DropdownItem
                            icon={<Heart size={16} />}
                            label="Favorites"
                            to="/favorites"
                            onClick={() => setIsProfileOpen(false)}
                            badge={favoritesCount}
                          />
                          {!isDonor && (
                            <DropdownItem
                              icon={<Handshake size={16} />}
                              label="Become a Donor"
                              to="/register-donor"
                              onClick={() => setIsProfileOpen(false)}
                            />
                          )}
                          <DropdownItem
                            icon={<Settings size={16} />}
                            label="Settings"
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          {isAdmin && (
                            <DropdownItem
                              icon={<Shield size={16} />}
                              label="Admin Panel"
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                            />
                          )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1" />

                        {/* Logout */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false)
                            setShowLogoutModal(true)
                          }}
                          className={[
                            'w-full flex items-center gap-3',
                            'px-4 py-2.5',
                            'text-sm font-medium text-red-600',
                            'hover:bg-red-50',
                            'transition-colors duration-150',
                          ].join(' ')}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>

                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className={[
                      'text-sm font-semibold text-gray-600',
                      'hover:text-red-600',
                      'transition-colors duration-200',
                      'px-3 py-2 rounded-xl hover:bg-red-50',
                    ].join(' ')}
                  >
                    Login
                  </Link>

                  {/* Register Button */}
                  <Link
                    to="/signup"
                    className={[
                      'text-sm font-semibold text-white',
                      'bg-red-600 hover:bg-red-700',
                      'px-4 py-2 rounded-xl',
                      'transition-colors duration-200',
                      'shadow-sm hover:shadow-md',
                    ].join(' ')}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile Right Actions ──────────── */}
            <div className="flex md:hidden items-center gap-2">

              {/* Mobile Favorites */}
              {isLoggedIn && (
                <Link
                  to="/favorites"
                  className="relative p-2 text-gray-500 hover:text-red-600"
                  aria-label="Favorites"
                >
                  <Heart size={20} />
                  {favoritesCount > 0 && (
                    <span className="absolute top-0.5 right-0.5">
                      <CountBadge count={favoritesCount} />
                    </span>
                  )}
                </Link>
              )}

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className={[
                  'p-2 rounded-xl',
                  'text-gray-600 hover:text-red-600',
                  'hover:bg-red-50',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-red-500',
                ].join(' ')}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen
                  ? <X    size={22} />
                  : <Menu size={22} />
                }
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────── */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={[
              'md:hidden',
              'bg-white border-t border-gray-100',
              'animate-slide-down',
            ].join(' ')}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

              {/* Nav Links */}
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => [
                    'flex items-center px-4 py-3 rounded-xl',
                    'text-sm font-medium',
                    'transition-colors duration-150',
                    isActive
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-red-600',
                  ].join(' ')}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-100 my-2" />

              {isLoggedIn ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className={[
                      'w-10 h-10 rounded-full',
                      'bg-red-600 text-white',
                      'flex items-center justify-center',
                      'text-sm font-bold flex-shrink-0',
                    ].join(' ')}>
                      {userInitial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Links */}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => [
                      'flex items-center gap-3 px-4 py-3 rounded-xl',
                      'text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <User size={16} />
                    My Profile
                  </NavLink>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setShowLogoutModal(true)
                    }}
                    className={[
                      'w-full flex items-center gap-3',
                      'px-4 py-3 rounded-xl',
                      'text-sm font-medium text-red-600',
                      'hover:bg-red-50',
                      'transition-colors duration-150',
                    ].join(' ')}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    className={[
                      'w-full text-center py-3 rounded-xl',
                      'text-sm font-semibold',
                      'border-2 border-red-600 text-red-600',
                      'hover:bg-red-50',
                      'transition-colors duration-200',
                    ].join(' ')}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={[
                      'w-full text-center py-3 rounded-xl',
                      'text-sm font-semibold',
                      'bg-red-600 hover:bg-red-700 text-white',
                      'transition-colors duration-200',
                    ].join(' ')}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      {/* ── Logout Modal ───────────────────────── */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* ── Spacer — pushes page content below fixed navbar ── */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}

export default Navbar

// ════════════════════════════════════════════════════
//  DROPDOWN ITEM HELPER
// ════════════════════════════════════════════════════
const DropdownItem = ({
  icon,
  label,
  to,
  onClick,
  badge,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={[
        'flex items-center gap-3',
        'px-4 py-2.5',
        'text-sm font-medium text-gray-700',
        'hover:bg-gray-50 hover:text-red-600',
        'transition-colors duration-150',
      ].join(' ')}
    >
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <CountBadge count={badge} />
      )}
    </Link>
  )
}