import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Spinner } from '../components/ui/Loader.jsx'

// ════════════════════════════════════════════════════
//  PROTECTED ROUTE
// ════════════════════════════════════════════════════
// wraps any page that requires login
// redirects to /login with the intended path saved
// so after login the user is sent back where they came from
const ProtectedRoute = ({
  children,
  redirectTo    = '/login',
  requireDonor  = false,
  requireAdmin  = false,
}) => {

  const { currentUser, isLoggedIn, isDonor, isAdmin, loading } = useAuth()
  const location = useLocation()

  // ── Still Loading Auth State ──────────────────────
  // wait for localStorage session restore to finish
  // before deciding to redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="xl" color="red" />
          <p className="text-sm text-gray-500 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  // ── Not Logged In ─────────────────────────────────
  // save the intended path in location state
  // so LoginPage can redirect back after login
  if (!isLoggedIn) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  // ── Requires Donor Role ───────────────────────────
  if (requireDonor && !isDonor && !isAdmin) {
    return (
      <Navigate
        to="/register-donor"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  // ── Requires Admin Role ───────────────────────────
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ message: 'You do not have permission to access this page.' }}
        replace
      />
    )
  }

  // ── Authorized ───────────────────────────────────
  return children
}

export default ProtectedRoute

// ════════════════════════════════════════════════════
//  DONOR ONLY ROUTE
// ════════════════════════════════════════════════════
// shorthand for routes only donors can access
export const DonorRoute = ({ children }) => {
  return (
    <ProtectedRoute requireDonor>
      {children}
    </ProtectedRoute>
  )
}

// ════════════════════════════════════════════════════
//  ADMIN ONLY ROUTE
// ════════════════════════════════════════════════════
// shorthand for routes only admins can access
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin>
      {children}
    </ProtectedRoute>
  )
}

// ════════════════════════════════════════════════════
//  ROLE BADGE HELPER — shows role restriction info
// ════════════════════════════════════════════════════
export const RouteAccessDenied = ({
  message = 'You do not have access to this page.',
  redirectLabel = 'Go Home',
  redirectPath  = '/',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-sm">

        {/* Icon */}
        <div className={[
          'w-20 h-20 rounded-full',
          'bg-red-100 text-red-400',
          'flex items-center justify-center',
          'mx-auto mb-5',
        ].join(' ')}>
          <span className="text-4xl" aria-hidden="true">🔒</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {message}
        </p>

        {/* Back Button */}
        <a
          href={redirectPath}
          className={[
            'inline-flex items-center gap-2',
            'px-6 py-2.5 rounded-xl',
            'bg-red-600 hover:bg-red-700',
            'text-white font-semibold text-sm',
            'transition-colors duration-200',
          ].join(' ')}
        >
          {redirectLabel}
        </a>

      </div>
    </div>
  )
}