import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Droplets,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
// ════════════════════════════════════════════════════
//  LOGIN PAGE
// ════════════════════════════════════════════════════
const LoginPage = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleLogin, loading, authError, clearError } = useAuth()
  const { showSuccess, showError } = useUI()

  // ── Redirect destination after login ─────────────
  const from = location.state?.from ?? '/'

  // ── Form State ────────────────────────────────────
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  console.log('[LoginPage] Render state:', { authError, loginError, email: form.email, password: form.password })

  // ── Clear Auth Error On Unmount ───────────────────
  useEffect(() => {
    return () => clearError()
  }, [])

  // ── Handle Field Change ───────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (authError) clearError()
    if (loginError) setLoginError('')
  }

  // ── Handle Submit ─────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault()

    const emailVal = form.email ? form.email.trim() : ''
    const passwordVal = form.password ? form.password : ''

    const emailEmpty = emailVal.length === 0
    const passwordEmpty = passwordVal.length === 0

    if (emailEmpty && passwordEmpty) {
      const msg = 'Please enter your email and password.'
      setErrors({ email: msg, password: msg })
      showError(msg)
      return
    }

    if (emailEmpty) {
      const msg = 'Email is required.'
      setErrors({ email: msg })
      showError(msg)
      return
    }

    if (passwordEmpty) {
      const msg = 'Password is required.'
      setErrors({ password: msg })
      showError(msg)
      return
    }

    try {
      console.log('[LoginPage] handleSubmit calling login with:', emailVal)
      await login(emailVal, passwordVal)
      showSuccess('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('[LoginPage] handleSubmit caught login error:', error)
      const msg = error.message || 'Incorrect password. Please try again.'

      if (msg === 'Email not found. Please check your email address.') {
        setErrors({ email: msg })
      } else if (msg === 'Incorrect password. Please try again.') {
        setErrors({ password: msg })
      } else {
        setLoginError(msg)
      }
      showError(msg)
    }
  }

  // ── Handle Google Login ───────────────────────────
  const handleGoogleLogin = async () => {
    try {
      await googleLogin()
      showSuccess('Welcome!')
      navigate(from, { replace: true })
    } catch (error) {
      showError(error.message || 'Google sign-in failed. Please try again.')
    }
  }

  // ── Handle Enter Key ──────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left Panel (desktop illustration) ── */}
      <div className={[
        'hidden lg:flex lg:w-1/2',
        'bg-red-600 flex-col items-center justify-center',
        'p-12 relative overflow-hidden',
      ].join(' ')}>

        {/* Background Circles */}
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-sm">

          {/* Logo */}
          <div className={[
            'w-20 h-20 rounded-full bg-white/20',
            'flex items-center justify-center',
            'mx-auto mb-8',
            'animate-heartbeat',
          ].join(' ')}>
            <Droplets size={40} className="text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back!
          </h1>
          <p className="text-red-100 text-lg leading-relaxed mb-8">
            Login to your account and continue your journey
            of saving lives through blood donation.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '2.5K+', label: 'Donors' },
              { value: '1.2K+', label: 'Lives Saved' },
              { value: '50+', label: 'Cities' },
              { value: '24/7', label: 'Available' },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-white/10 rounded-2xl p-4"
              >
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-red-100 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-8 p-4 bg-white/10 rounded-2xl">
            <p className="text-red-100 text-sm italic leading-relaxed">
              "Every drop of blood you donate is a drop of life
              you give to someone who needs it most."
            </p>
          </div>

        </div>
      </div>

      {/* ── Right Panel (form) ──────────────── */}
      <div className={[
        'flex-1 flex flex-col items-center justify-center',
        'p-6 sm:p-12',
        'bg-white lg:bg-gray-50',
      ].join(' ')}>

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className={[
              'w-8 h-8 rounded-full bg-red-600',
              'flex items-center justify-center',
            ].join(' ')}>
              <Droplets size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Blood<span className="text-red-600">Connect</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Login to your account
            </h2>
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-red-600 font-semibold hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Login Error Banner */}
          {(loginError || authError) && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-300 rounded-2xl"
            >
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-semibold">
                {loginError || authError}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              onKeyDown={handleKeyDown}
              error={errors.email}
              required
              autoComplete="email"
              leftIcon={<Mail size={16} />}
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onKeyDown={handleKeyDown}
                error={errors.password}
                required
                autoComplete="current-password"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff size={16} />
                      : <Eye size={16} />
                    }
                  </button>
                }
              />

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className={[
                    'text-xs text-red-600',
                    'hover:underline font-medium',
                    'transition-colors duration-150',
                  ].join(' ')}
                  onClick={() =>
                    alert('Password reset coming soon!')
                  }
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight size={18} />}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={[
              'w-full flex items-center justify-center gap-3',
              'px-4 py-3 rounded-2xl',
              'border-2 border-gray-200 bg-white',
              'hover:border-gray-300 hover:bg-gray-50',
              'transition-all duration-150',
              'font-semibold text-sm text-gray-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            {/* Google Icon */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          {/* <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">
              OR
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          {/* Demo Accounts */}
          {/* <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
              Demo Accounts
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label:    'Demo User',
                  email:    'demo@bloodconnect.com',
                  password: 'demo123',
                  role:     'User',
                  color:    'blue',
                },
                {
                  label:    'Demo Donor',
                  email:    'sridhar@bloodconnect.com',
                  password: 'sridhar123',
                  role:     'Donor',
                  color:    'red',
                },
              ].map(account => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setForm({
                      email:    account.email,
                      password: account.password,
                    })
                    setErrors({})
                  }}
                  className={[
                    'flex items-center justify-between',
                    'px-4 py-3 rounded-xl',
                    'border border-gray-200',
                    'hover:border-red-300 hover:bg-red-50',
                    'transition-all duration-150',
                    'text-left group',
                  ].join(' ')}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700">
                      {account.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {account.email}
                    </p>
                  </div>
                  <span className={[
                    'text-xs font-bold px-2 py-1 rounded-full',
                    account.color === 'red'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600',
                  ].join(' ')}>
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">
              Click a demo account to fill credentials, then press Login
            </p>
          </div> */}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            New to BloodConnect?{' '}
            <Link
              to="/signup"
              className="text-red-600 font-semibold hover:underline"
            >
              Create a free account
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage