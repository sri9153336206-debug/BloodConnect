import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'

// ── Pages ────────────────────────────────────────────
import HomePage           from '../pages/HomePage.jsx'
import FindDonorPage      from '../pages/FindDonorPage.jsx'
import DonorDetailsPage   from '../pages/DonorDetailsPage.jsx'
import RegisterDonorPage  from '../pages/RegisterDonorPage.jsx'
import LoginPage          from '../pages/LoginPage.jsx'
import SignupPage         from '../pages/SignupPage.jsx'
import ProfilePage        from '../pages/ProfilePage.jsx'
import FavoritesPage      from '../pages/FavoritesPage.jsx'
import AboutPage          from '../pages/AboutPage.jsx'
import ContactPage        from '../pages/ContactPage.jsx'
import FaqPage            from '../pages/FaqPage.jsx'
import NotFoundPage       from '../pages/NotFoundPage.jsx'
import AdminLayout          from '../layouts/AdminLayout.jsx'
import AdminRoute           from '../routes/AdminRoute.jsx'
import AdminDashboardPage   from '../pages/admin/AdminDashboardPage.jsx'
import ManageDonorsPage     from '../pages/admin/ManageDonorsPage.jsx'
import ManageUsersPage      from '../pages/admin/ManageUsersPage.jsx'
import ManageQueriesPage    from '../pages/admin/ManageQueriesPage.jsx'

// ── Route Guard ──────────────────────────────────────
import ProtectedRoute     from './ProtectedRoute.jsx'

// ════════════════════════════════════════════════════
//  APP ROUTER
// ════════════════════════════════════════════════════
const AppRouter = () => {
  return (
    <Routes>

      {/* ── Main Layout Wrapper ─────────────────
           All routes inside here share the
           Navbar + Footer from MainLayout        */}
      <Route element={<MainLayout />}>

        {/* ── Public Routes ─────────────────── */}

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index          element={<AdminDashboardPage />} />
          <Route path="donors"  element={<ManageDonorsPage />}  />
          <Route path="users"   element={<ManageUsersPage />}   />
          <Route path="queries" element={<ManageQueriesPage />} />
        </Route>

        {/* Home */}
        <Route
          index
          element={<HomePage />}
        />

        {/* Find Donors */}
        <Route
          path="find-donors"
          element={<FindDonorPage />}
        />

        {/* Donor Details */}
        <Route
          path="donor/:id"
          element={<DonorDetailsPage />}
        />

        {/* About */}
        <Route
          path="about"
          element={<AboutPage />}
        />

        {/* Contact */}
        <Route
          path="contact"
          element={<ContactPage />}
        />

        {/* FAQ */}
        <Route
          path="faq"
          element={<FaqPage />}
        />

        {/* ── Auth Routes ───────────────────────
             Redirect to home if already logged in */}

        {/* Login */}
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* Signup */}
        <Route
          path="signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />

        {/* ── Protected Routes ──────────────────
             Redirect to login if not logged in   */}

        {/* Register as Donor */}
        <Route
          path="register-donor"
          element={
            <ProtectedRoute>
              <RegisterDonorPage />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Favorites */}
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        {/* ── Redirect Aliases ──────────────── */}
        <Route
          path="home"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="donors"
          element={<Navigate to="/find-donors" replace />}
        />
        <Route
          path="register"
          element={<Navigate to="/register-donor" replace />}
        />

        {/* ── 404 Not Found ─────────────────── */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Route>

    </Routes>
  )
}

export default AppRouter

// ════════════════════════════════════════════════════
//  GUEST ROUTE
// ════════════════════════════════════════════════════
// redirects logged-in users away from auth pages
// e.g. if already logged in, /login → /
const GuestRoute = ({ children }) => {
  const isLoggedIn = Boolean(
    (() => {
      try {
        const user = localStorage.getItem('bc_current_user')
        return user ? JSON.parse(user) : null
      } catch {
        return null
      }
    })()
  )

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}