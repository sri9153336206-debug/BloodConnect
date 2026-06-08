import { useState, useEffect } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import {
  Droplets,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUI }   from '../context/UIContext.jsx'
import Input, { SelectInput } from '../components/ui/Input.jsx'
import Button                 from '../components/ui/Button.jsx'
import BloodGroupSelector     from '../components/features/BloodGroupSelector.jsx'
import {
  validateSignupForm,
  hasErrors,
} from '../utils/validators.js'
import { CITIES } from '../constants/index.js'

// ════════════════════════════════════════════════════
//  PASSWORD STRENGTH INDICATOR
// ════════════════════════════════════════════════════
const PasswordStrength = ({ password }) => {
  if (!password) return null

  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6     },
    { label: 'Contains a number',     pass: /\d/.test(password)       },
    { label: 'Contains a letter',     pass: /[a-zA-Z]/.test(password) },
  ]

  const score  = checks.filter(c => c.pass).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="space-y-2 mt-1">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={[
              'flex-1 h-1.5 rounded-full transition-all duration-300',
              i < score ? colors[score] : 'bg-gray-100',
            ].join(' ')}
          />
        ))}
      </div>
      {/* Label */}
      <p className={[
        'text-xs font-medium',
        score === 0 ? 'text-gray-400'   : '',
        score === 1 ? 'text-red-500'    : '',
        score === 2 ? 'text-orange-500' : '',
        score === 3 ? 'text-green-600'  : '',
      ].join(' ')}>
        {score === 0 ? 'Enter a password' : labels[score - 1]}
      </p>
      {/* Checks */}
      <ul className="space-y-1">
        {checks.map(check => (
          <li
            key={check.label}
            className={[
              'flex items-center gap-1.5 text-xs',
              check.pass ? 'text-green-600' : 'text-gray-400',
            ].join(' ')}
          >
            <CheckCircle2
              size={11}
              className={check.pass ? 'text-green-500' : 'text-gray-300'}
            />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  SIGNUP PAGE
// ════════════════════════════════════════════════════
const SignupPage = () => {

  const navigate = useNavigate()
  const { signup, googleLogin, loading, authError, clearError } = useAuth()
  const { showSuccess } = useUI()

  // ── Form State ────────────────────────────────────
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    phone:           '',
    password:        '',
    confirmPassword: '',
    bloodGroup:      '',
    location:        '',
  })

  const [errors,     setErrors]     = useState({})
  const [step,       setStep]       = useState(1)
  const [showPass,   setShowPass]   = useState(false)
  const [showConf,   setShowConf]   = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

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
  }

  // ── Validate Step 1 ───────────────────────────────
  const validateStep1 = () => {
    const allErrors = validateSignupForm(form)
    const step1Errors = {}
    if (allErrors.name)            step1Errors.name            = allErrors.name
    if (allErrors.email)           step1Errors.email           = allErrors.email
    if (allErrors.phone)           step1Errors.phone           = allErrors.phone
    if (allErrors.password)        step1Errors.password        = allErrors.password
    if (allErrors.confirmPassword) step1Errors.confirmPassword = allErrors.confirmPassword
    setErrors(prev => ({ ...prev, ...step1Errors }))
    return Object.keys(step1Errors).length === 0
  }

  // ── Handle Next ───────────────────────────────────
  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  // ── Handle Submit ─────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!agreeTerms) {
      setErrors(prev => ({
        ...prev,
        terms: 'You must agree to the terms to continue',
      }))
      return
    }

    try {
      await signup({
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        password: form.password,
        bloodGroup: form.bloodGroup,
        location:   form.location,
      })
      showSuccess('Account created successfully! Welcome to BloodConnect!')
      navigate('/')
    } catch {
      // error shown via authError
    }
  }

  // ── Handle Google Sign-In ──────────────────────────
  const handleGoogleLogin = async () => {
    try {
      await googleLogin()
      showSuccess('Welcome to BloodConnect!')
      navigate('/')
    } catch {
      // error shown via authError
    }
  }

  // ── Render ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left Panel ──────────────────────── */}
      <div className={[
        'hidden lg:flex lg:w-5/12',
        'bg-gray-900 flex-col',
        'items-center justify-center',
        'p-12 relative overflow-hidden',
      ].join(' ')}>

        {/* Decorations */}
        <div
          className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full -translate-y-1/3 translate-x-1/3"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 bg-red-600/10 rounded-full translate-y-1/3 -translate-x-1/3"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">

          {/* Logo */}
          <div className={[
            'w-16 h-16 rounded-2xl bg-red-600',
            'flex items-center justify-center',
            'mx-auto mb-6',
            'animate-heartbeat',
          ].join(' ')}>
            <Droplets size={32} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Join BloodConnect
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            Create your free account and become part of
            a community that saves lives every day.
          </p>

          {/* Benefits */}
          <div className="space-y-4 text-left">
            {[
              {
                icon:  '🔍',
                title: 'Find Donors Fast',
                desc:  'Search donors by blood group and location instantly',
              },
              {
                icon:  '❤️',
                title: 'Save Favorites',
                desc:  'Save donors you trust for quick access later',
              },
              {
                icon:  '💉',
                title: 'Become a Donor',
                desc:  'Register as a donor and help save up to 3 lives',
              },
              {
                icon:  '🔔',
                title: 'Stay Connected',
                desc:  'Manage your profile and availability anytime',
              },
            ].map(benefit => (
              <div
                key={benefit.title}
                className="flex items-start gap-3"
              >
                <span className="text-xl flex-shrink-0">
                  {benefit.icon}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {benefit.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Right Panel ─────────────────────── */}
      <div className={[
        'flex-1 flex flex-col items-center justify-center',
        'p-6 sm:p-10 bg-white',
        'overflow-y-auto',
      ].join(' ')}>

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <Droplets size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Blood<span className="text-red-600">Connect</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h2>
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-red-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Google Sign-In */}
          <div className="w-full mb-5">
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
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR sign up with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { num: 1, label: 'Account Info'    },
              { num: 2, label: 'Profile Details' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={[
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    'text-xs font-bold transition-all duration-200',
                    step === s.num
                      ? 'bg-red-600 text-white'
                      : step > s.num
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400',
                  ].join(' ')}>
                    {step > s.num
                      ? <CheckCircle2 size={12} />
                      : s.num
                    }
                  </div>
                  <span className={[
                    'text-xs font-medium',
                    step === s.num ? 'text-red-600' : 'text-gray-400',
                  ].join(' ')}>
                    {s.label}
                  </span>
                </div>
                {i === 0 && (
                  <div className={[
                    'flex-1 h-px w-8',
                    step > 1 ? 'bg-green-400' : 'bg-gray-200',
                  ].join(' ')} />
                )}
              </div>
            ))}
          </div>

          {/* Auth Error */}
          {authError && (
            <div className={[
              'flex items-start gap-3 p-4 mb-5',
              'bg-red-50 border border-red-200 rounded-2xl',
              'animate-fade-in',
            ].join(' ')}>
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                {authError}
              </p>
            </div>
          )}

          {/* ── Step 1: Account Info ───────────── */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">

              {/* Name */}
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                error={errors.name}
                required
                leftIcon={<User size={16} />}
                autoComplete="name"
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                error={errors.email}
                required
                leftIcon={<Mail size={16} />}
                autoComplete="email"
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                error={errors.phone}
                required
                leftIcon={<Phone size={16} />}
                maxLength={10}
                helperText="Used for donor contact (Indian number)"
              />

              {/* Password */}
              <div>
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  error={errors.password}
                  required
                  leftIcon={<Lock size={16} />}
                  autoComplete="new-password"
                />
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type={showConf ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                leftIcon={<Lock size={16} />}
                autoComplete="new-password"
              />

              {/* Next Button */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleNext}
                rightIcon={<ArrowRight size={18} />}
              >
                Continue
              </Button>

            </div>
          )}

          {/* ── Step 2: Profile Details ────────── */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 animate-fade-in"
            >

              {/* Blood Group */}
              <BloodGroupSelector
                label="Blood Group (optional)"
                value={form.bloodGroup}
                onChange={val => handleChange('bloodGroup', val)}
                size="md"
                showLabel
              />

              {/* Location */}
              <SelectInput
                label="Your City (optional)"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                options={CITIES.map(c => ({ label: c, value: c }))}
                placeholder="Select your city"
                leftIcon={<MapPin size={16} />}
              />

              {/* Info Note */}
              <div className={[
                'flex items-start gap-2.5 p-3 rounded-xl',
                'bg-blue-50 border border-blue-100',
              ].join(' ')}>
                <AlertCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Blood group and location help us show you
                  relevant donors. You can update these anytime
                  from your profile.
                </p>
              </div>

              {/* Terms */}
              <div className="space-y-1">
                <label className={[
                  'flex items-start gap-3 cursor-pointer group',
                ].join(' ')}>
                  <div className="mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => {
                        setAgreeTerms(e.target.checked)
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: '' }))
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <span className="text-red-600 font-medium hover:underline cursor-pointer">
                      Terms of Service
                    </span>
                    {' '}and{' '}
                    <span className="text-red-600 font-medium hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    . I understand my phone number may be
                    visible to donors.
                  </span>
                </label>

                {errors.terms && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 ml-7">
                    <AlertCircle size={11} />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  rightIcon={<CheckCircle2 size={18} />}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>

              {/* Skip Note */}
              <p className="text-xs text-gray-400 text-center">
                Blood group and location are optional.
                You can add them later in your profile.
              </p>

            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignupPage