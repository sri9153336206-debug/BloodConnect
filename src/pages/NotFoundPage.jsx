import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState, useEffect }            from 'react'
import {
  Home,
  Search,
  ArrowLeft,
  Droplets,
  Heart,
  RefreshCw,
} from 'lucide-react'
import { useAuth }   from '../context/AuthContext.jsx'
import { useDonors } from '../context/DonorContext.jsx'
import Button        from '../components/ui/Button.jsx'
import { NAV_LINKS } from '../constants/index.js'

// ════════════════════════════════════════════════════
//  NOT FOUND PAGE
// ════════════════════════════════════════════════════
const NotFoundPage = () => {

  const navigate                     = useNavigate()
  const location                     = useLocation()
  const { isLoggedIn }               = useAuth()
  const { stats }                    = useDonors()

  // ── Animated Counter ──────────────────────────────
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target   = 404
    const duration = 1000
    const steps    = 60
    const increment = target / steps
    let current    = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  // ── Attempted Path ────────────────────────────────
  const attemptedPath = location.pathname

  // ── Suggested Links ───────────────────────────────
  const suggestedLinks = [
    {
      label:       'Home',
      path:        '/',
      icon:        <Home     size={16} />,
      description: 'Go back to the homepage',
      color:       'red',
    },
    {
      label:       'Find Donors',
      path:        '/find-donors',
      icon:        <Search   size={16} />,
      description: 'Search for blood donors',
      color:       'blue',
    },
    {
      label:       'Become a Donor',
      path:        isLoggedIn ? '/register-donor' : '/signup',
      icon:        <Droplets size={16} />,
      description: 'Register as a blood donor',
      color:       'green',
    },
    {
      label:       'Favorites',
      path:        '/favorites',
      icon:        <Heart    size={16} />,
      description: 'View your saved donors',
      color:       'pink',
    },
  ]

  // ── Color Map ─────────────────────────────────────
  const colorMap = {
    red:   { bg: 'bg-red-50',   text: 'text-red-600',   border: 'border-red-100',   hover: 'hover:border-red-300'   },
    blue:  { bg: 'bg-blue-50',  text: 'text-blue-600',  border: 'border-blue-100',  hover: 'hover:border-blue-300'  },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', hover: 'hover:border-green-300' },
    pink:  { bg: 'bg-pink-50',  text: 'text-pink-600',  border: 'border-pink-100',  hover: 'hover:border-pink-300'  },
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* ══════════════════════════════════════════
             MAIN 404 BLOCK
        ══════════════════════════════════════════ */}
        <div className="max-w-2xl w-full text-center animate-fade-in">

          {/* Blood Drop + 404 */}
          <div className="relative inline-block mb-8">

            {/* Giant 404 Text */}
            <div className="relative">
              <span
                className={[
                  'text-[120px] sm:text-[160px] font-black',
                  'text-red-600 leading-none',
                  'select-none',
                ].join(' ')}
                aria-hidden="true"
              >
                {count}
              </span>

              {/* Blood Drop Overlay */}
              <div className={[
                'absolute top-1/2 left-1/2',
                '-translate-x-1/2 -translate-y-1/2',
                'w-20 h-20 sm:w-24 sm:h-24',
                'rounded-full',
                'bg-white border-4 border-red-100',
                'flex items-center justify-center',
                'shadow-lg',
                'animate-heartbeat',
              ].join(' ')}>
                <Droplets
                  size={36}
                  className="text-red-500"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Decorative Dots */}
            <div
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-100 rounded-full opacity-60"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-2 -left-6 w-5 h-5 bg-red-200 rounded-full opacity-40"
              aria-hidden="true"
            />

          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-base leading-relaxed mb-3 max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist
            or has been moved. Don't worry — let's get you
            back on track.
          </p>

          {/* Attempted Path */}
          {attemptedPath && attemptedPath !== '/' && (
            <div className={[
              'inline-flex items-center gap-2',
              'px-4 py-2 rounded-xl mb-8',
              'bg-gray-100 border border-gray-200',
              'text-sm text-gray-500',
            ].join(' ')}>
              <span className="font-medium">Tried to visit:</span>
              <code className="font-mono text-red-500 font-semibold">
                {attemptedPath}
              </code>
            </div>
          )}

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
              leftIcon={<Home size={18} />}
            >
              Go Back Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft size={18} />}
            >
              Go Back
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCw size={18} />}
            >
              Refresh
            </Button>
          </div>

          {/* ── Suggested Links ────────────────── */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              You might be looking for
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {suggestedLinks.map(link => {
                const colors = colorMap[link.color] ?? colorMap.red
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={[
                      'flex items-center gap-3',
                      'p-4 rounded-2xl border',
                      'bg-white',
                      'transition-all duration-150',
                      'hover:shadow-sm group',
                      colors.border,
                      colors.hover,
                    ].join(' ')}
                  >
                    {/* Icon */}
                    <div className={[
                      'w-9 h-9 rounded-xl flex-shrink-0',
                      'flex items-center justify-center',
                      colors.bg,
                      colors.text,
                    ].join(' ')}>
                      {link.icon}
                    </div>

                    {/* Text */}
                    <div className="text-left min-w-0">
                      <p className={[
                        'text-sm font-semibold',
                        'text-gray-800 group-hover:' + colors.text.replace('text-', 'text-'),
                        'transition-colors duration-150',
                      ].join(' ')}>
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── All Nav Links ──────────────────── */}
          <div className="border-t border-gray-100 pt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              All Pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={[
                    'px-3 py-1.5 rounded-full',
                    'text-xs font-medium',
                    'text-gray-500 hover:text-red-600',
                    'border border-gray-200 hover:border-red-300',
                    'bg-white hover:bg-red-50',
                    'transition-all duration-150',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
           BOTTOM STATS STRIP
      ══════════════════════════════════════════ */}
      <div className="border-t border-gray-100 bg-white py-5">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left: Branding */}
            <div className="flex items-center gap-2">
              <div className={[
                'w-7 h-7 rounded-full bg-red-600',
                'flex items-center justify-center',
              ].join(' ')}>
                <Droplets size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </div>

            {/* Right: Live Stats */}
            <div className="flex items-center gap-5">
              <StatPill
                value={`${stats.total}+`}
                label="Donors"
                color="text-red-600"
              />
              <StatPill
                value={`${stats.available}+`}
                label="Available Now"
                color="text-green-600"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/find-donors')}
              >
                Find Donors
              </Button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default NotFoundPage

// ════════════════════════════════════════════════════
//  STAT PILL HELPER
// ════════════════════════════════════════════════════
const StatPill = ({ value, label, color }) => (
  <div className="text-center">
    <p className={['text-sm font-bold', color].join(' ')}>
      {value}
    </p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
)