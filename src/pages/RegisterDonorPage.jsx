import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import {
  Droplets,
  User,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Clock,
  XCircle,
} from 'lucide-react'
import { useAuth }    from '../context/AuthContext.jsx'
import { useDonors }  from '../context/DonorContext.jsx'
import { useUI }      from '../context/UIContext.jsx'
import BloodGroupSelector  from '../components/features/BloodGroupSelector.jsx'
import Input, { Textarea, SelectInput } from '../components/ui/Input.jsx'
import Button              from '../components/ui/Button.jsx'
import { OverlayLoader }   from '../components/ui/Loader.jsx'
import {
  validateDonorForm,
  hasErrors,
} from '../utils/validators.js'
import {
  GENDER_OPTIONS,
  CITIES,
} from '../constants/index.js'

// ════════════════════════════════════════════════════
//  STEP CONFIG
// ════════════════════════════════════════════════════
const STEPS = [
  { id: 1, label: 'Personal Info',  icon: <User     size={16} /> },
  { id: 2, label: 'Blood & Health', icon: <Droplets size={16} /> },
  { id: 3, label: 'Contact',        icon: <Phone    size={16} /> },
  { id: 4, label: 'Confirm',        icon: <CheckCircle2 size={16} /> },
]

// ════════════════════════════════════════════════════
//  STEP INDICATOR
// ════════════════════════════════════════════════════
const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">

        {/* Step Circle */}
        <div className="flex flex-col items-center">
          <div className={[
            'w-9 h-9 rounded-full',
            'flex items-center justify-center',
            'border-2 font-bold text-sm',
            'transition-all duration-300',
            currentStep === step.id
              ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200'
              : currentStep > step.id
              ? 'bg-green-500 border-green-500 text-white'
              : 'bg-white border-gray-200 text-gray-400',
          ].join(' ')}>
            {currentStep > step.id
              ? <CheckCircle2 size={16} />
              : step.id
            }
          </div>
          <span className={[
            'text-xs mt-1 font-medium hidden sm:block',
            'whitespace-nowrap',
            currentStep === step.id
              ? 'text-red-600'
              : currentStep > step.id
              ? 'text-green-600'
              : 'text-gray-400',
          ].join(' ')}>
            {step.label}
          </span>
        </div>

        {/* Connector Line */}
        {index < steps.length - 1 && (
          <div className={[
            'w-12 sm:w-20 h-0.5 mx-1',
            'transition-colors duration-300',
            currentStep > step.id
              ? 'bg-green-400'
              : 'bg-gray-200',
          ].join(' ')} />
        )}

      </div>
    ))}
  </div>
)

// ════════════════════════════════════════════════════
//  REGISTER DONOR PAGE
// ════════════════════════════════════════════════════
const RegisterDonorPage = () => {

  const navigate   = useNavigate()
  const { currentUser, linkDonorId, isDonor, updateProfile, syncProfile } = useAuth()
  const { addDonor }   = useDonors()
  const { showSuccess, showError } = useUI()

  // ── Sync profile state on mount ───────────────────
  useState(() => {
    syncProfile()
  })

  // ── Redirect If Already A Donor ───────────────────
  if (isDonor || currentUser?.donorStatus === 'approved') {
    return (
      <AlreadyDonorScreen
        onViewProfile={() => navigate(`/donor/${currentUser?.donorId}`)}
        onGoHome={() => navigate('/')}
      />
    )
  }

  // ── Render Pending Screen ─────────────────────────
  if (currentUser?.donorStatus === 'pending') {
    return (
      <PendingApprovalScreen
        onGoHome={() => navigate('/')}
      />
    )
  }

  // ── Render Rejected Screen ────────────────────────
  if (currentUser?.donorStatus === 'rejected') {
    const handleReapply = async () => {
      try {
        await updateProfile({ donorId: null, donorStatus: null })
        showSuccess('Application state reset. You can register again.')
      } catch (err) {
        showError('Failed to reset application state.')
      }
    }
    return (
      <RejectedScreen
        onReapply={handleReapply}
        onGoHome={() => navigate('/')}
      />
    )
  }

  // ── State ─────────────────────────────────────────
  const [step,        setStep]       = useState(1)
  const [submitting,  setSubmitting] = useState(false)
  const [submitted,   setSubmitted]  = useState(false)

  // ── Form Data ─────────────────────────────────────
  const [form, setForm] = useState({
    name:         currentUser?.name    ?? '',
    age:          '',
    gender:       '',
    bloodGroup:   currentUser?.bloodGroup ?? '',
    location:     currentUser?.location   ?? '',
    phone:        currentUser?.phone      ?? '',
    availability: true,
    about:        '',
  })

  // ── Errors ────────────────────────────────────────
  const [errors, setErrors] = useState({})

  // ── Handle Field Change ───────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // ── Validate Current Step ─────────────────────────
  const validateStep = (stepNum) => {
    let stepErrors = {}

    if (stepNum === 1) {
      const allErrors = validateDonorForm(form)
      if (allErrors.name)   stepErrors.name   = allErrors.name
      if (allErrors.age)    stepErrors.age    = allErrors.age
      if (allErrors.gender) stepErrors.gender = allErrors.gender
    }

    if (stepNum === 2) {
      const allErrors = validateDonorForm(form)
      if (allErrors.bloodGroup) stepErrors.bloodGroup = allErrors.bloodGroup
    }

    if (stepNum === 3) {
      const allErrors = validateDonorForm(form)
      if (allErrors.location) stepErrors.location = allErrors.location
      if (allErrors.phone)    stepErrors.phone    = allErrors.phone
    }

    setErrors(prev => ({ ...prev, ...stepErrors }))
    return Object.keys(stepErrors).length === 0
  }

  // ── Handle Next Step ──────────────────────────────
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  // ── Handle Prev Step ──────────────────────────────
  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  // ── Handle Submit ─────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const newDonor = await addDonor({
        userId:       currentUser.id,
        name:         form.name.trim(),
        age:          parseInt(form.age, 10),
        gender:       form.gender,
        bloodGroup:   form.bloodGroup,
        location:     form.location.trim(),
        phone:        form.phone.trim(),
        availability: form.availability,
        about:        form.about.trim(),
      })

      // link donor ID to user account
      await linkDonorId(newDonor.id)

      setSubmitted(true)
      showSuccess('Donor application submitted for review!')
    } catch (err) {
      showError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success Screen ────────────────────────────────
  if (submitted) {
    return (
      <SuccessScreen
        onViewProfile={() => navigate('/profile')}
        onFindDonors={() => navigate('/find-donors')}
      />
    )
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={[
            'flex items-center gap-1.5 mb-6',
            'text-sm text-gray-500 hover:text-red-600',
            'transition-colors duration-150',
          ].join(' ')}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={[
            'w-14 h-14 rounded-2xl bg-red-600',
            'flex items-center justify-center',
            'mx-auto mb-4',
          ].join(' ')}>
            <Droplets size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Become a Donor
          </h1>
          <p className="text-gray-500 text-sm">
            Fill in your details to help save lives
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={STEPS} />

        {/* Form Card */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">

          {/* Overlay Loader */}
          <OverlayLoader
            visible={submitting}
            message="Registering you as a donor..."
          />

          {/* ── Step 1: Personal Info ──────────── */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <StepTitle
                number={1}
                title="Personal Information"
                subtitle="Tell us about yourself"
              />

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                error={errors.name}
                required
                leftIcon={<User size={16} />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  placeholder="Your age"
                  value={form.age}
                  onChange={e => handleChange('age', e.target.value)}
                  error={errors.age}
                  required
                  min={18}
                  max={65}
                  helperText="Must be 18–65 years"
                />

                <SelectInput
                  label="Gender"
                  value={form.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  options={GENDER_OPTIONS}
                  placeholder="Select gender"
                  error={errors.gender}
                  required
                />
              </div>

            </div>
          )}

          {/* ── Step 2: Blood & Health ─────────── */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <StepTitle
                number={2}
                title="Blood & Health Info"
                subtitle="Select your blood group"
              />

              <BloodGroupSelector
                value={form.bloodGroup}
                onChange={val => handleChange('bloodGroup', val)}
                error={errors.bloodGroup}
                required
                size="lg"
              />

              {/* About */}
              <Textarea
                label="About Yourself (optional)"
                placeholder="Tell donors something about yourself, your donation history, availability..."
                value={form.about}
                onChange={e => handleChange('about', e.target.value)}
                error={errors.about}
                rows={3}
                maxLength={300}
                helperText="Short bio visible on your donor profile"
              />

              {/* Availability Toggle */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available to donate now?
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleChange('availability', !form.availability)
                  }
                  className={[
                    'w-full flex items-center justify-between',
                    'px-4 py-3 rounded-xl border-2',
                    'transition-all duration-200',
                    form.availability
                      ? 'bg-green-50 border-green-400 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600',
                  ].join(' ')}
                  aria-pressed={form.availability}
                >
                  <span className="text-sm font-medium">
                    {form.availability
                      ? '✓ Available to donate now'
                      : 'Not available right now'}
                  </span>
                  <div className={[
                    'w-10 h-5 rounded-full relative',
                    'transition-colors duration-200',
                    form.availability ? 'bg-green-500' : 'bg-gray-300',
                  ].join(' ')}>
                    <div className={[
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
                      'transition-transform duration-200',
                      form.availability ? 'translate-x-5' : 'translate-x-0.5',
                    ].join(' ')} />
                  </div>
                </button>
              </div>

            </div>
          )}

          {/* ── Step 3: Contact ────────────────── */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <StepTitle
                number={3}
                title="Contact Information"
                subtitle="How donors can reach you"
              />

              <SelectInput
                label="City / Location"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                options={CITIES.map(c => ({ label: c, value: c }))}
                placeholder="Select your city"
                error={errors.location}
                required
                leftIcon={<MapPin size={16} />}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                error={errors.phone}
                required
                leftIcon={<Phone size={16} />}
                helperText="This number will be shown to people searching for donors"
                maxLength={10}
              />

              {/* Privacy Note */}
              <div className={[
                'flex items-start gap-2.5',
                'p-3 rounded-xl',
                'bg-blue-50 border border-blue-100',
              ].join(' ')}>
                <AlertCircle
                  size={16}
                  className="text-blue-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Your phone number will be visible to people searching
                  for donors. Only share if you are comfortable being
                  contacted directly.
                </p>
              </div>

            </div>
          )}

          {/* ── Step 4: Confirm ────────────────── */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <StepTitle
                number={4}
                title="Review & Confirm"
                subtitle="Check your details before submitting"
              />

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">

                <SummaryRow label="Name"        value={form.name} />
                <SummaryRow
                  label="Age & Gender"
                  value={`${form.age} yrs, ${form.gender}`}
                />
                <SummaryRow
                  label="Blood Group"
                  value={form.bloodGroup}
                  valueClass="font-bold text-red-600 text-base"
                />
                <SummaryRow label="Location" value={form.location} />
                <SummaryRow label="Phone"    value={form.phone} />
                <SummaryRow
                  label="Availability"
                  value={form.availability ? 'Available Now' : 'Not Available'}
                  valueClass={
                    form.availability
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-500'
                  }
                />
                {form.about && (
                  <SummaryRow label="About" value={form.about} />
                )}

              </div>

              {/* Consent */}
              <div className={[
                'flex items-start gap-3',
                'p-4 rounded-xl',
                'bg-red-50 border border-red-100',
              ].join(' ')}>
                <Droplets
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-700 leading-relaxed">
                  By registering, you agree to be contacted by people
                  in need of{' '}
                  <strong>{form.bloodGroup}</strong> blood.
                  You can update your availability anytime from your profile.
                </p>
              </div>

            </div>
          )}

          {/* ── Navigation Buttons ─────────────── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">

            {/* Prev */}
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={step === 1}
              leftIcon={<ArrowLeft size={16} />}
            >
              Previous
            </Button>

            {/* Next / Submit */}
            {step < STEPS.length ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={submitting}
                leftIcon={<Droplets size={16} />}
              >
                Register as Donor
              </Button>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default RegisterDonorPage

// ════════════════════════════════════════════════════
//  STEP TITLE HELPER
// ════════════════════════════════════════════════════
const StepTitle = ({ number, title, subtitle }) => (
  <div className="mb-2">
    <div className="flex items-center gap-2 mb-1">
      <span className={[
        'w-6 h-6 rounded-full',
        'bg-red-600 text-white',
        'flex items-center justify-center',
        'text-xs font-bold flex-shrink-0',
      ].join(' ')}>
        {number}
      </span>
      <h2 className="text-lg font-bold text-gray-900">
        {title}
      </h2>
    </div>
    <p className="text-sm text-gray-500 ml-8">
      {subtitle}
    </p>
  </div>
)

// ════════════════════════════════════════════════════
//  SUMMARY ROW HELPER
// ════════════════════════════════════════════════════
const SummaryRow = ({
  label,
  value,
  valueClass = '',
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-sm text-gray-500 flex-shrink-0 w-28">
      {label}
    </span>
    <span className={[
      'text-sm text-gray-800 text-right',
      valueClass,
    ].join(' ')}>
      {value}
    </span>
  </div>
)

// ════════════════════════════════════════════════════
//  SUCCESS SCREEN
// ════════════════════════════════════════════════════
const SuccessScreen = ({ onViewProfile, onFindDonors }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

      {/* Icon */}
      <div className={[
        'w-24 h-24 rounded-full',
        'bg-yellow-50',
        'flex items-center justify-center',
        'mx-auto mb-6',
        'animate-scale-in',
      ].join(' ')}>
        <Clock size={48} className="text-yellow-500 animate-pulse" />
      </div>

      {/* Text */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Application Submitted! 📋
      </h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Thank you for your application to save lives! Your profile has been sent to the admin for review.
        Once approved, you will be visible on the Find Donors page and get access to donor settings.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onViewProfile}
          leftIcon={<User size={18} />}
        >
          Go to My Profile
        </Button>
      </div>

    </div>
  </div>
)

// ════════════════════════════════════════════════════
//  ALREADY DONOR SCREEN
// ════════════════════════════════════════════════════
const AlreadyDonorScreen = ({ onViewProfile, onGoHome }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-sm w-full text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

      <div className={[
        'w-20 h-20 rounded-full bg-red-100',
        'flex items-center justify-center',
        'mx-auto mb-5',
      ].join(' ')}>
        <Droplets size={36} className="text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Already a Donor
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        You are already registered as an approved donor.
        You can update your information from your profile page.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={onViewProfile}
        >
          View Donor Profile
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={onGoHome}
        >
          Go Home
        </Button>
      </div>

    </div>
  </div>
)

// ════════════════════════════════════════════════════
//  PENDING APPROVAL SCREEN
// ════════════════════════════════════════════════════
const PendingApprovalScreen = ({ onGoHome }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-5">
        <Clock size={36} className="text-yellow-500 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Application Pending Review
      </h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Your application to become a blood donor has been submitted successfully and is currently under review by our administrators.
        Once approved, your details will be published on the Find Donors directory and you will receive access to donor settings.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={onGoHome}>
          Go to Home
        </Button>
      </div>
    </div>
  </div>
)

// ════════════════════════════════════════════════════
//  REJECTED SCREEN
// ════════════════════════════════════════════════════
const RejectedScreen = ({ onReapply, onGoHome }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
        <XCircle size={36} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Application Rejected
      </h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Unfortunately, your application to become a blood donor has been rejected by the admin. This could be due to incomplete information or eligibility criteria.
        You can review and update your information to re-apply.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={onReapply}>
          Update Details & Re-apply
        </Button>
        <Button variant="secondary" fullWidth onClick={onGoHome}>
          Go to Home
        </Button>
      </div>
    </div>
  </div>
)