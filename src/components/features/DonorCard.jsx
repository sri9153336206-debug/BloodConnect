import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Heart,
  Droplets,
  Calendar,
  User,
  Eye,
} from 'lucide-react'
import { useAuth }      from '../../context/AuthContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useUI }        from '../../context/UIContext.jsx'
import {
  AvailabilityBadge,
  BloodGroupBadge,
  DonationBadge,
} from '../ui/Badge.jsx'
import { CallButton, MessageButton } from '../ui/Button.jsx'
import { formatDate } from '../../utils/validators.js'

// ════════════════════════════════════════════════════
//  DONOR CARD COMPONENT
// ════════════════════════════════════════════════════
const DonorCard = ({
  donor,
  showActions  = true,
  showContact  = true,
  compact      = false,
  className    = '',
}) => {

  const navigate                    = useNavigate()
  const { isLoggedIn }              = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showInfo }                = useUI()

  // ── Local State ───────────────────────────────────
  const [imgError, setImgError] = useState(false)

  // ── Guard ─────────────────────────────────────────
  if (!donor) return null

  const {
    id,
    name,
    bloodGroup,
    location,
    phone,
    availability,
    age,
    gender,
    donationsCount,
    lastDonationDate,
    photoUrl,
    about,
  } = donor

  // ── Derived ───────────────────────────────────────
  const isFav      = isFavorite(id)
  const initials   = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??'

  // ── Handle Favorite Toggle ────────────────────────
  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      showInfo('Please login to save favorites.')
      return
    }
    toggleFavorite(id)
  }

  // ── Handle Card Click → Donor Details ────────────
  const handleCardClick = () => {
    navigate(`/donor/${id}`)
  }

  // ── Handle View Profile ───────────────────────────
  const handleViewProfile = (e) => {
    e.stopPropagation()
    navigate(`/donor/${id}`)
  }

  // ── Render ───────────────────────────────────────
  return (
    <div
      className={[
        // base
        'bg-white rounded-2xl border border-gray-100',
        'transition-all duration-200',
        'hover:shadow-lg hover:border-red-100',
        'hover:-translate-y-0.5',
        'cursor-pointer',
        'animate-fade-in',
        'group',
        compact ? 'p-4' : 'p-5',
        className,
      ].filter(Boolean).join(' ')}
      onClick={handleCardClick}
      role="article"
      aria-label={`${name} - ${bloodGroup} donor in ${location}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleCardClick()
      }}
    >

      {/* ── Top Row ─────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-4">

        {/* Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {!imgError && photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className={[
                  'rounded-full object-cover',
                  'border-2 border-gray-100',
                  'group-hover:border-red-200',
                  'transition-colors duration-200',
                  compact ? 'w-10 h-10' : 'w-12 h-12',
                ].join(' ')}
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className={[
                'rounded-full flex-shrink-0',
                'bg-red-100 text-red-600',
                'flex items-center justify-center',
                'font-bold border-2 border-red-200',
                compact ? 'w-10 h-10 text-xs' : 'w-12 h-12 text-sm',
              ].join(' ')}>
                {initials}
              </div>
            )}

            {/* Online/Available Dot */}
            {availability && (
              <span
                className={[
                  'absolute -bottom-0.5 -right-0.5',
                  'w-3 h-3 rounded-full',
                  'bg-green-500 border-2 border-white',
                ].join(' ')}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Name + Location */}
          <div className="min-w-0">
            <h3 className={[
              'font-bold text-gray-900 truncate',
              'group-hover:text-red-600',
              'transition-colors duration-150',
              compact ? 'text-sm' : 'text-base',
            ].join(' ')}>
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin
                size={11}
                className="text-gray-400 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500 truncate">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Blood Group + Favorite */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Blood Group Badge */}
          <BloodGroupBadge
            bloodGroup={bloodGroup}
            size={compact ? 'sm' : 'md'}
          />

          {/* Favorite Button */}
          {showActions && (
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={[
                'w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-red-400',
                isFav
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500',
              ].join(' ')}
              aria-label={isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
              aria-pressed={isFav}
            >
              <Heart
                size={15}
                className={[
                  'transition-all duration-200',
                  isFav ? 'fill-red-500' : '',
                ].join(' ')}
              />
            </button>
          )}

        </div>
      </div>

      {/* ── Middle Row: Status + Info ────────── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">

        {/* Availability Badge */}
        <AvailabilityBadge
          available={availability}
          showDot
          size="sm"
        />

        {/* Donations Count */}
        {!compact && donationsCount > 0 && (
          <DonationBadge
            count={donationsCount}
            size="sm"
          />
        )}

        {/* Gender + Age */}
        {!compact && (age || gender) && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <User size={11} aria-hidden="true" />
            <span>
              {[gender, age ? `${age} yrs` : null]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

      </div>

      {/* ── About Text (non-compact only) ────── */}
      {!compact && about && (
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {about}
        </p>
      )}

      {/* ── Last Donation ─────────────────────── */}
      {!compact && lastDonationDate && (
        <div className="flex items-center gap-1.5 mb-4">
          <Calendar
            size={12}
            className="text-gray-400 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-gray-400">
            Last donated:{' '}
            <span className="text-gray-600 font-medium">
              {formatDate(lastDonationDate)}
            </span>
          </span>
        </div>
      )}

      {/* ── Divider ──────────────────────────── */}
      {showContact && (
        <div className="border-t border-gray-100 mb-4" />
      )}

      {/* ── Action Buttons ───────────────────── */}
      {showContact && (
        <div
          className="flex gap-2"
          onClick={e => e.stopPropagation()}
        >
          {/* Call Button */}
          <CallButton
            phone={phone}
            size="sm"
            fullWidth
          />

          {/* Message Button */}
          <MessageButton
            phone={phone}
            name={name}
            size="sm"
            fullWidth
          />

          {/* View Profile Button */}
          <button
            type="button"
            onClick={handleViewProfile}
            className={[
              'flex items-center justify-center',
              'w-9 h-9 flex-shrink-0 rounded-xl',
              'bg-gray-50 hover:bg-red-50',
              'text-gray-400 hover:text-red-600',
              'border border-gray-200 hover:border-red-200',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-red-400',
            ].join(' ')}
            aria-label={`View ${name}'s profile`}
          >
            <Eye size={15} />
          </button>

        </div>
      )}

    </div>
  )
}

export default DonorCard

// ════════════════════════════════════════════════════
//  DONOR LIST ITEM — horizontal compact version
// ════════════════════════════════════════════════════
export const DonorListItem = ({
  donor,
  onClick,
  showFavorite = true,
  className    = '',
}) => {

  const navigate                       = useNavigate()
  const { isLoggedIn }                 = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showInfo }                   = useUI()

  if (!donor) return null

  const { id, name, bloodGroup, location, availability, photoUrl } = donor
  const isFav    = isFavorite(id)
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '??'

  const handleFav = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      showInfo('Please login to save favorites.')
      return
    }
    toggleFavorite(id)
  }

  const handleClick = () => {
    if (onClick) onClick(donor)
    else navigate(`/donor/${id}`)
  }

  return (
    <div
      className={[
        'flex items-center gap-3 p-3',
        'bg-white rounded-xl border border-gray-100',
        'hover:border-red-100 hover:shadow-sm',
        'cursor-pointer transition-all duration-150',
        'group',
        className,
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClick()
      }}
      aria-label={`${name} - ${bloodGroup}`}
    >

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        )}
        {availability && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors duration-150">
          {name}
        </p>
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-gray-400" />
          <p className="text-xs text-gray-500 truncate">{location}</p>
        </div>
      </div>

      {/* Blood Group */}
      <BloodGroupBadge bloodGroup={bloodGroup} size="sm" />

      {/* Favorite */}
      {showFavorite && (
        <button
          type="button"
          onClick={handleFav}
          className={[
            'w-7 h-7 rounded-full flex items-center justify-center',
            'transition-colors duration-150 flex-shrink-0',
            isFav
              ? 'text-red-500'
              : 'text-gray-300 hover:text-red-400',
          ].join(' ')}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={14}
            className={isFav ? 'fill-red-500' : ''}
          />
        </button>
      )}

    </div>
  )
}

// ════════════════════════════════════════════════════
//  DONOR GRID — renders a grid of DonorCards
// ════════════════════════════════════════════════════
export const DonorGrid = ({
  donors       = [],
  showActions  = true,
  showContact  = true,
  compact      = false,
  columns      = 3,
  className    = '',
}) => {

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  if (!donors || donors.length === 0) return null

  return (
    <div className={[
      'grid gap-4',
      colClasses[columns] ?? colClasses[3],
      className,
    ].filter(Boolean).join(' ')}>
      {donors.map(donor => (
        <DonorCard
          key={donor.id}
          donor={donor}
          showActions={showActions}
          showContact={showContact}
          compact={compact}
        />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  FEATURED DONOR CARD — larger card for homepage
// ════════════════════════════════════════════════════
export const FeaturedDonorCard = ({
  donor,
  className = '',
}) => {

  const navigate = useNavigate()
  if (!donor) return null

  const {
    id,
    name,
    bloodGroup,
    location,
    phone,
    donationsCount,
    availability,
    photoUrl,
  } = donor

  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '??'

  return (
    <div
      className={[
        'bg-white rounded-2xl border border-gray-100',
        'p-6 hover:shadow-lg hover:border-red-100',
        'transition-all duration-200 hover:-translate-y-0.5',
        'cursor-pointer group',
        className,
      ].filter(Boolean).join(' ')}
      onClick={() => navigate(`/donor/${id}`)}
      role="article"
      aria-label={`Featured donor: ${name}`}
    >

      {/* Top */}
      <div className="flex items-center justify-between mb-4">
        {/* Avatar */}
        <div className="relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-14 h-14 rounded-full border-2 border-red-100 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-base">
              {initials}
            </div>
          )}
          {availability && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>

        {/* Blood Group */}
        <BloodGroupBadge bloodGroup={bloodGroup} size="lg" />
      </div>

      {/* Info */}
      <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-150 mb-1">
        {name}
      </h3>

      <div className="flex items-center gap-1 mb-3">
        <MapPin size={12} className="text-gray-400" />
        <span className="text-xs text-gray-500">{location}</span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <AvailabilityBadge available={availability} showDot size="sm" />
        {donationsCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Droplets size={12} className="text-red-400" />
            <span>{donationsCount} donations</span>
          </div>
        )}
      </div>

      {/* Call Button */}
      <div
        className="mt-4"
        onClick={e => e.stopPropagation()}
      >
        <CallButton phone={phone} fullWidth size="sm" />
      </div>

    </div>
  )
}