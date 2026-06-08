import { CheckCircle2, XCircle, Clock, Shield, Droplets, Star } from 'lucide-react'

// ════════════════════════════════════════════════════
//  BADGE VARIANTS CONFIG
// ════════════════════════════════════════════════════
const variants = {
  available: {
    base:    'bg-green-100 text-green-700 border border-green-200',
    dot:     'bg-green-500',
    icon:    <CheckCircle2 size={12} />,
    label:   'Available',
  },
  unavailable: {
    base:    'bg-gray-100 text-gray-500 border border-gray-200',
    dot:     'bg-gray-400',
    icon:    <XCircle size={12} />,
    label:   'Not Available',
  },
  verified: {
    base:    'bg-blue-100 text-blue-700 border border-blue-200',
    dot:     'bg-blue-500',
    icon:    <Shield size={12} />,
    label:   'Verified',
  },
  pending: {
    base:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot:     'bg-yellow-500',
    icon:    <Clock size={12} />,
    label:   'Pending',
  },
  donor: {
    base:    'bg-red-100 text-red-700 border border-red-200',
    dot:     'bg-red-500',
    icon:    <Droplets size={12} />,
    label:   'Donor',
  },
  featured: {
    base:    'bg-purple-100 text-purple-700 border border-purple-200',
    dot:     'bg-purple-500',
    icon:    <Star size={12} />,
    label:   'Featured',
  },
  success: {
    base:    'bg-green-100 text-green-700 border border-green-200',
    dot:     'bg-green-500',
    icon:    <CheckCircle2 size={12} />,
    label:   'Success',
  },
  error: {
    base:    'bg-red-100 text-red-700 border border-red-200',
    dot:     'bg-red-500',
    icon:    <XCircle size={12} />,
    label:   'Error',
  },
  info: {
    base:    'bg-blue-100 text-blue-700 border border-blue-200',
    dot:     'bg-blue-500',
    icon:    null,
    label:   'Info',
  },
  warning: {
    base:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot:     'bg-yellow-500',
    icon:    <Clock size={12} />,
    label:   'Warning',
  },
}

// ════════════════════════════════════════════════════
//  BADGE SIZES CONFIG
// ════════════════════════════════════════════════════
const sizes = {
  xs: 'px-1.5 py-0.5 text-xs gap-1',
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-1.5',
}

// ════════════════════════════════════════════════════
//  MAIN BADGE COMPONENT
// ════════════════════════════════════════════════════
const Badge = ({
  // content
  label,
  children,

  // style
  variant   = 'info',
  size      = 'md',
  rounded   = true,
  showIcon  = true,
  showDot   = false,
  className = '',

  // interaction
  onClick,
}) => {

  // ── Get Variant Config ─────────────────────────────
  const config = variants[variant] ?? variants.info

  // ── Base Classes ──────────────────────────────────
  const baseClasses = [
    'inline-flex items-center font-semibold',
    'transition-colors duration-200',
    rounded ? 'rounded-full' : 'rounded-md',
    onClick ? 'cursor-pointer hover:opacity-80' : '',
    config.base,
    sizes[size] ?? sizes.md,
    className,
  ].filter(Boolean).join(' ')

  // ── Display Label ─────────────────────────────────
  const displayLabel = children ?? label ?? config.label

  return (
    <span
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Dot Indicator */}
      {showDot && (
        <span
          className={[
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            config.dot,
          ].join(' ')}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      {showIcon && config.icon && !showDot && (
        <span className="flex-shrink-0" aria-hidden="true">
          {config.icon}
        </span>
      )}

      {/* Label */}
      <span>{displayLabel}</span>
    </span>
  )
}

export default Badge

// ════════════════════════════════════════════════════
//  AVAILABILITY BADGE
// ════════════════════════════════════════════════════
// most used badge in the app — shows donor availability
export const AvailabilityBadge = ({
  available,
  size      = 'md',
  showDot   = true,
  showIcon  = false,
  className = '',
}) => {
  return (
    <Badge
      variant={available ? 'available' : 'unavailable'}
      size={size}
      showDot={showDot}
      showIcon={showIcon}
      className={className}
    >
      {available ? 'Available' : 'Not Available'}
    </Badge>
  )
}

// ════════════════════════════════════════════════════
//  BLOOD GROUP BADGE
// ════════════════════════════════════════════════════
// circular red badge showing blood group — A+, O-, etc
export const BloodGroupBadge = ({
  bloodGroup,
  size      = 'md',
  className = '',
}) => {

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={[
        'flex items-center justify-center',
        'rounded-full',
        'bg-red-100 text-red-700',
        'font-bold flex-shrink-0',
        'border-2 border-red-200',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Blood group ${bloodGroup}`}
    >
      {bloodGroup}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  ROLE BADGE
// ════════════════════════════════════════════════════
// shows user role — user, donor, admin
export const RoleBadge = ({
  role,
  size      = 'sm',
  className = '',
}) => {
  const roleConfig = {
    donor: { variant: 'donor',   label: 'Donor' },
    admin: { variant: 'warning', label: 'Admin' },
    user:  { variant: 'info',    label: 'User'  },
  }

  const config = roleConfig[role] ?? roleConfig.user

  return (
    <Badge
      variant={config.variant}
      size={size}
      showIcon={false}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

// ════════════════════════════════════════════════════
//  COUNT BADGE
// ════════════════════════════════════════════════════
// small number badge — used on nav items, favorites count
export const CountBadge = ({
  count,
  max       = 99,
  className = '',
  color     = 'red',
}) => {
  if (!count || count <= 0) return null

  const colorClasses = {
    red:    'bg-red-600 text-white',
    green:  'bg-green-600 text-white',
    blue:   'bg-blue-600 text-white',
    gray:   'bg-gray-500 text-white',
  }

  const displayCount = count > max ? `${max}+` : count

  return (
    <span
      className={[
        'inline-flex items-center justify-center',
        'min-w-[18px] h-[18px]',
        'rounded-full px-1',
        'text-xs font-bold',
        'leading-none',
        colorClasses[color] ?? colorClasses.red,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`${count} items`}
    >
      {displayCount}
    </span>
  )
}

// ════════════════════════════════════════════════════
//  DONATION COUNT BADGE
// ════════════════════════════════════════════════════
// shows total donations with a droplet icon
export const DonationBadge = ({
  count,
  size      = 'md',
  className = '',
}) => {
  return (
    <div
      className={[
        'inline-flex items-center gap-1.5',
        'bg-red-50 text-red-600',
        'rounded-full border border-red-100',
        'font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      ].filter(Boolean).join(' ')}
    >
      <Droplets size={size === 'sm' ? 10 : 12} aria-hidden="true" />
      <span>{count} {count === 1 ? 'donation' : 'donations'}</span>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  NEW BADGE
// ════════════════════════════════════════════════════
// small "NEW" tag for recently registered donors
export const NewBadge = ({ className = '' }) => {
  return (
    <span
      className={[
        'inline-flex items-center',
        'px-1.5 py-0.5',
        'bg-red-600 text-white',
        'text-xs font-bold',
        'rounded',
        'tracking-wide uppercase',
        className,
      ].filter(Boolean).join(' ')}
    >
      New
    </span>
  )
}

// ════════════════════════════════════════════════════
//  STATUS DOT
// ════════════════════════════════════════════════════
// just a small colored dot — used in tables and lists
export const StatusDot = ({
  available,
  size      = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={[
        'inline-block rounded-full flex-shrink-0',
        available ? 'bg-green-500' : 'bg-gray-400',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={available ? 'Available' : 'Not available'}
    />
  )
}

// ════════════════════════════════════════════════════
//  TAG BADGE
// ════════════════════════════════════════════════════
// removable tag — used in filter chips
export const TagBadge = ({
  label,
  onRemove,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'px-2.5 py-1',
        'bg-red-50 text-red-700',
        'border border-red-200',
        'rounded-full',
        'text-xs font-medium',
        className,
      ].filter(Boolean).join(' ')}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={[
            'flex items-center justify-center',
            'w-3.5 h-3.5 rounded-full',
            'hover:bg-red-200',
            'transition-colors duration-150',
            'focus:outline-none',
          ].join(' ')}
          aria-label={`Remove ${label} filter`}
        >
          <XCircle size={10} />
        </button>
      )}
    </span>
  )
}

// ════════════════════════════════════════════════════
//  STATUS BADGE
// ════════════════════════════════════════════════════
// shows donor application status: pending, approved, rejected
export const StatusBadge = ({
  status,
  size      = 'sm',
  className = '',
}) => {
  const statusConfig = {
    approved: { variant: 'available', label: 'Approved' },
    pending:  { variant: 'pending',   label: 'Pending' },
    rejected: { variant: 'error',     label: 'Rejected' },
  }

  const config = statusConfig[status] ?? statusConfig.pending

  return (
    <Badge
      variant={config.variant}
      size={size}
      showIcon={true}
      className={className}
    >
      {config.label}
    </Badge>
  )
}