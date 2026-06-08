import { useEffect, useState }         from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  User,
  Droplets,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
  Heart,
} from 'lucide-react'
import { useDonors }    from '../context/DonorContext.jsx'
import { useAuth }      from '../context/AuthContext.jsx'
import { useUI }        from '../context/UIContext.jsx'
import { getDonorById } from '../services/mockApi.js'
import ContactButtons, {
  EmergencyContactBanner,
} from '../components/features/ContactButtons.jsx'
import {
  BloodGroupInfoCard,
} from '../components/features/BloodGroupSelector.jsx'
import {
  AvailabilityBadge,
  BloodGroupBadge,
  DonationBadge,
} from '../components/ui/Badge.jsx'
import { ProfileSkeleton } from '../components/ui/Loader.jsx'
import { ErrorState }      from '../components/ui/EmptyState.jsx'
import {
  formatDate,
  formatPhone,
  daysSinceLastDonation,
  isEligibleToDonate,
} from '../utils/validators.js'

// ════════════════════════════════════════════════════
//  DONOR DETAILS PAGE
// ════════════════════════════════════════════════════
const DonorDetailsPage = () => {

  const { id }       = useParams()
  const navigate     = useNavigate()
  const { showInfo } = useUI()
  const { getDonorFromState, toggleAvailability, actionLoading } = useDonors()
  const { currentUser, isDonor } = useAuth()

  // ── State ────────────────────────────────────────
  const [donor,   setDonor]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [imgError, setImgError] = useState(false)

  // ── Is This The Current User's Own Profile ────────
  const isOwnProfile = currentUser?.donorId === id

  // ── Fetch Donor ───────────────────────────────────
  useEffect(() => {
    const fetchDonor = async () => {
      setLoading(true)
      setError(null)
      try {
        // try local state first (fast)
        const localDonor = getDonorFromState(id)
        if (localDonor) {
          setDonor(localDonor)
          setLoading(false)
          return
        }
        // fallback to API
        const data = await getDonorById(id)
        setDonor(data)
      } catch (err) {
        setError(err.message ?? 'Failed to load donor details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchDonor()
  }, [id])

  // ── Derived Values ────────────────────────────────
  const daysSince   = donor ? daysSinceLastDonation(donor.lastDonationDate) : null
  const isEligible  = donor ? isEligibleToDonate(donor.lastDonationDate)    : false
  const initials    = donor?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??'

  // ── Handle Toggle Availability ────────────────────
  const handleToggleAvailability = async () => {
    if (!donor) return
    try {
      const updated = await toggleAvailability(donor.id)
      setDonor(updated)
      showInfo(
        updated.availability
          ? 'You are now marked as available!'
          : 'You are now marked as unavailable.'
      )
    } catch {
      showInfo('Failed to update availability.')
    }
  }

  // ── Loading ───────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────
  if (error || !donor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message={error ?? 'Donor not found.'}
          onRetry={() => navigate('/find-donors')}
        />
      </div>
    )
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ══════════════════════════════════════════
           BACK BUTTON + BREADCRUMB
      ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={[
                'flex items-center gap-1.5',
                'text-gray-500 hover:text-red-600',
                'transition-colors duration-150',
                'focus:outline-none',
              ].join(' ')}
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span className="text-gray-300" aria-hidden="true">/</span>
            <Link
              to="/find-donors"
              className="text-gray-500 hover:text-red-600 transition-colors duration-150"
            >
              Find Donors
            </Link>
            <span className="text-gray-300" aria-hidden="true">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[140px]">
              {donor.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ───────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

              {/* Cover */}
              <div className="h-20 bg-gradient-to-r from-red-500 to-red-600" />

              {/* Avatar */}
              <div className="px-5 pb-5">
                <div className="relative -mt-10 mb-4">
                  {!imgError && donor.photoUrl ? (
                    <img
                      src={donor.photoUrl}
                      alt={donor.name}
                      className={[
                        'w-20 h-20 rounded-2xl',
                        'border-4 border-white',
                        'object-cover shadow-lg',
                      ].join(' ')}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className={[
                      'w-20 h-20 rounded-2xl',
                      'border-4 border-white shadow-lg',
                      'bg-red-100 text-red-600',
                      'flex items-center justify-center',
                      'font-bold text-xl',
                    ].join(' ')}>
                      {initials}
                    </div>
                  )}

                  {/* Availability Dot */}
                  <span
                    className={[
                      'absolute -bottom-1 -right-1',
                      'w-5 h-5 rounded-full border-2 border-white',
                      donor.availability ? 'bg-green-500' : 'bg-gray-300',
                    ].join(' ')}
                    aria-label={donor.availability ? 'Available' : 'Unavailable'}
                  />
                </div>

                {/* Name + Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {donor.name}
                    </h1>
                    <AvailabilityBadge
                      available={donor.availability}
                      showDot
                      size="sm"
                    />
                  </div>
                  <BloodGroupBadge
                    bloodGroup={donor.bloodGroup}
                    size="lg"
                  />
                </div>

                {/* Info Rows */}
                <ul className="space-y-2.5">
                  <InfoRow
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={donor.location}
                  />
                  <InfoRow
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={formatPhone(donor.phone)}
                  />
                  <InfoRow
                    icon={<User size={14} />}
                    label="Age & Gender"
                    value={`${donor.age} yrs, ${donor.gender}`}
                  />
                  <InfoRow
                    icon={<Droplets size={14} />}
                    label="Blood Group"
                    value={donor.bloodGroup}
                    valueClass="font-bold text-red-600"
                  />
                </ul>

                {/* Edit Profile Button (own profile) */}
                {isOwnProfile && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className={[
                        'w-full py-2 rounded-xl',
                        'border-2 border-gray-200',
                        'text-sm font-semibold text-gray-600',
                        'hover:border-red-300 hover:text-red-600',
                        'transition-all duration-200',
                      ].join(' ')}
                    >
                      Edit Profile
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Donation Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Droplets size={15} className="text-red-500" />
                Donation History
              </h3>

              <div className="space-y-3">
                {/* Total Donations */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Donations</span>
                  <DonationBadge count={donor.donationsCount} size="sm" />
                </div>

                {/* Last Donated */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Donated</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(donor.lastDonationDate)}
                    </span>
                  </div>
                </div>

                {/* Days Since */}
                {daysSince !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Days Since</span>
                    <span className="text-sm font-medium text-gray-700">
                      {daysSince} days ago
                    </span>
                  </div>
                )}

                {/* Eligible To Donate */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Eligible to Donate
                  </span>
                  <div className="flex items-center gap-1">
                    {isEligible ? (
                      <>
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Yes
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-orange-400" />
                        <span className="text-sm font-medium text-orange-500">
                          Not yet
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Eligibility Bar */}
                {daysSince !== null && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">
                        Recovery Progress
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {Math.min(daysSince, 90)}/90 days
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={[
                          'h-full rounded-full transition-all duration-500',
                          isEligible ? 'bg-green-500' : 'bg-orange-400',
                        ].join(' ')}
                        style={{
                          width: `${Math.min((daysSince / 90) * 100, 100)}%`
                        }}
                        role="progressbar"
                        aria-valuenow={Math.min(daysSince, 90)}
                        aria-valuemin={0}
                        aria-valuemax={90}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Availability Toggle (own profile) */}
            {isOwnProfile && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock size={15} className="text-blue-500" />
                  Availability
                </h3>
                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  disabled={actionLoading}
                  className={[
                    'w-full flex items-center justify-between',
                    'px-4 py-3 rounded-xl border-2',
                    'transition-all duration-200',
                    'focus:outline-none',
                    donor.availability
                      ? 'bg-green-50 border-green-400 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600',
                    actionLoading ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                  aria-pressed={donor.availability}
                >
                  <span className="text-sm font-semibold">
                    {donor.availability
                      ? 'Currently Available'
                      : 'Currently Unavailable'}
                  </span>
                  <div className={[
                    'relative w-10 h-5 rounded-full',
                    'transition-colors duration-200',
                    donor.availability ? 'bg-green-500' : 'bg-gray-300',
                  ].join(' ')}>
                    <div className={[
                      'absolute top-0.5 w-4 h-4',
                      'rounded-full bg-white shadow-sm',
                      'transition-transform duration-200',
                      donor.availability
                        ? 'translate-x-5'
                        : 'translate-x-0.5',
                    ].join(' ')} />
                  </div>
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Toggle to update your availability status
                </p>
              </div>
            )}

          </div>

          {/* ── Right Column ───────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Emergency Contact Banner */}
            {donor.availability && !isOwnProfile && (
              <EmergencyContactBanner
                phone={donor.phone}
                donorName={donor.name}
              />
            )}

            {/* About Donor */}
            {donor.about && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  About Donor
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {donor.about}
                </p>
              </div>
            )}

            {/* Contact Buttons */}
            {!isOwnProfile && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  Contact Donor
                </h2>
                <ContactButtons
                  donor={donor}
                  size="md"
                  layout="row"
                  showShare
                  showFav
                  showCopy
                />
              </div>
            )}

            {/* Blood Group Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Droplets size={16} className="text-red-500" />
                Blood Group Information
              </h2>
              <BloodGroupInfoCard
                bloodGroup={donor.bloodGroup}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">

                {/* Share Profile */}
                <QuickActionCard
                  icon={<Share2 size={20} className="text-blue-500" />}
                  label="Share Profile"
                  description="Share this donor's profile"
                  onClick={async () => {
                    const url = `${window.location.origin}/donor/${donor.id}`
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: `${donor.name} - BloodConnect`,
                          url,
                        })
                      } else {
                        await navigator.clipboard.writeText(url)
                        showInfo('Profile link copied!')
                      }
                    } catch {
                      showInfo('Could not share profile.')
                    }
                  }}
                />

                {/* Find Similar */}
                <QuickActionCard
                  icon={<Droplets size={20} className="text-red-500" />}
                  label="Find Similar"
                  description={`More ${donor.bloodGroup} donors`}
                  onClick={() =>
                    navigate(
                      `/find-donors?bloodGroup=${encodeURIComponent(donor.bloodGroup)}`
                    )
                  }
                />

                {/* Save to Favorites */}
                <QuickActionCard
                  icon={<Heart size={20} className="text-pink-500" />}
                  label="Save Donor"
                  description="Add to your favorites"
                  onClick={() =>
                    navigate('/favorites')
                  }
                />

                {/* All Donors */}
                <QuickActionCard
                  icon={<MapPin size={20} className="text-green-500" />}
                  label="Nearby Donors"
                  description={`Donors in ${donor.location.split(',')[0]}`}
                  onClick={() =>
                    navigate(
                      `/find-donors?q=${encodeURIComponent(
                        donor.location.split(',')[0]
                      )}`
                    )
                  }
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDetailsPage

// ════════════════════════════════════════════════════
//  INFO ROW HELPER
// ════════════════════════════════════════════════════
const InfoRow = ({
  icon,
  label,
  value,
  valueClass = '',
}) => (
  <li className="flex items-center gap-3">
    <span className="text-gray-400 flex-shrink-0">
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={[
        'text-sm text-gray-700 font-medium truncate',
        valueClass,
      ].join(' ')}>
        {value}
      </p>
    </div>
  </li>
)

// ════════════════════════════════════════════════════
//  QUICK ACTION CARD HELPER
// ════════════════════════════════════════════════════
const QuickActionCard = ({
  icon,
  label,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex flex-col items-start gap-2',
      'p-4 rounded-xl text-left',
      'border border-gray-100',
      'hover:border-red-200 hover:bg-red-50',
      'transition-all duration-150',
      'group',
    ].join(' ')}
  >
    <div className={[
      'w-10 h-10 rounded-xl',
      'bg-gray-50 group-hover:bg-white',
      'flex items-center justify-center',
      'transition-colors duration-150',
    ].join(' ')}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700">
        {label}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {description}
      </p>
    </div>
  </button>
)