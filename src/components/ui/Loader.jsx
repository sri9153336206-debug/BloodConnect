import { Droplets } from 'lucide-react'

// ════════════════════════════════════════════════════
//  SPINNER LOADER
// ════════════════════════════════════════════════════
// simple circular spinning loader
export const Spinner = ({
  size      = 'md',
  color     = 'red',
  className = '',
}) => {
  const sizeClasses = {
    xs:  'w-3 h-3 border-2',
    sm:  'w-4 h-4 border-2',
    md:  'w-6 h-6 border-2',
    lg:  'w-8 h-8 border-3',
    xl:  'w-10 h-10 border-4',
    '2xl': 'w-12 h-12 border-4',
  }

  const colorClasses = {
    red:   'border-red-200 border-t-red-600',
    white: 'border-white/30 border-t-white',
    gray:  'border-gray-200 border-t-gray-600',
    green: 'border-green-200 border-t-green-600',
    blue:  'border-blue-200 border-t-blue-600',
  }

  return (
    <div
      className={[
        'rounded-full animate-spin flex-shrink-0',
        sizeClasses[size]  ?? sizeClasses.md,
        colorClasses[color] ?? colorClasses.red,
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  FULL PAGE LOADER
// ════════════════════════════════════════════════════
// covers the entire screen — used during initial load
const Loader = ({
  message   = 'Loading...',
  showLogo  = true,
}) => {
  return (
    <div
      className={[
        'fixed inset-0 z-50',
        'flex flex-col items-center justify-center',
        'bg-white',
        'gap-6',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Logo + Heartbeat */}
      {showLogo && (
        <div className="flex flex-col items-center gap-3">
          {/* Blood Drop Icon */}
          <div className="relative">
            <div className={[
              'w-16 h-16 rounded-full',
              'bg-red-100',
              'flex items-center justify-center',
              'animate-heartbeat',
            ].join(' ')}>
              <Droplets
                size={32}
                className="text-red-600"
                aria-hidden="true"
              />
            </div>
            {/* Pulse Ring */}
            <div className={[
              'absolute inset-0 rounded-full',
              'border-4 border-red-300',
              'animate-ping opacity-75',
            ].join(' ')} />
          </div>

          {/* App Name */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Blood<span className="text-red-600">Connect</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Find Blood. Save Lives.
            </p>
          </div>
        </div>
      )}

      {/* Spinner + Message */}
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" color="red" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}

export default Loader

// ════════════════════════════════════════════════════
//  INLINE LOADER
// ════════════════════════════════════════════════════
// small loader inside a section — not full screen
export const InlineLoader = ({
  message   = 'Loading...',
  size      = 'md',
  className = '',
}) => {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'gap-3 py-12',
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size === 'md' ? 'xl' : size} color="red" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  CARD SKELETON LOADER
// ════════════════════════════════════════════════════
// animated placeholder while donor cards are loading
export const DonorCardSkeleton = () => {
  return (
    <div className={[
      'bg-white rounded-2xl',
      'border border-gray-100',
      'p-5 space-y-4',
      'animate-pulse',
    ].join(' ')}>

      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="space-y-2">
            {/* Name */}
            <div className="h-4 w-28 bg-gray-200 rounded-full" />
            {/* Location */}
            <div className="h-3 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
        {/* Blood Group */}
        <div className="w-10 h-10 rounded-full bg-red-100" />
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-24 bg-gray-100 rounded-full" />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Buttons Row */}
      <div className="flex gap-2">
        <div className="h-9 flex-1 bg-red-100 rounded-xl" />
        <div className="h-9 flex-1 bg-gray-100 rounded-xl" />
      </div>

    </div>
  )
}

// ════════════════════════════════════════════════════
//  SKELETON GRID — multiple card skeletons
// ════════════════════════════════════════════════════
export const DonorGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <DonorCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  PAGE SKELETON
// ════════════════════════════════════════════════════
// generic skeleton for any page section
export const PageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 py-8">
      {/* Page Title */}
      <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto" />
      {/* Subtitle */}
      <div className="h-4 w-64 bg-gray-100 rounded-full mx-auto" />
      {/* Content Block */}
      <div className="space-y-3 mt-8">
        <div className="h-4 bg-gray-100 rounded-full w-full" />
        <div className="h-4 bg-gray-100 rounded-full w-5/6" />
        <div className="h-4 bg-gray-100 rounded-full w-4/6" />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  PROFILE SKELETON
// ════════════════════════════════════════════════════
export const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="h-5 w-32 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-100 rounded-full" />
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-100" />
        {/* Info Rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 flex-1 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  BUTTON LOADER — spinner inside a button area
// ════════════════════════════════════════════════════
export const ButtonLoader = ({
  message   = 'Please wait...',
  className = '',
}) => {
  return (
    <div
      className={[
        'flex items-center justify-center gap-2',
        className,
      ].filter(Boolean).join(' ')}
      role="status"
    >
      <Spinner size="sm" color="white" />
      <span className="text-sm">{message}</span>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  OVERLAY LOADER
// ════════════════════════════════════════════════════
// semi-transparent overlay on top of content
// used during form submission
export const OverlayLoader = ({
  message   = 'Processing...',
  visible   = false,
}) => {
  if (!visible) return null

  return (
    <div
      className={[
        'absolute inset-0 z-40',
        'bg-white/80 backdrop-blur-sm',
        'flex flex-col items-center justify-center',
        'rounded-2xl gap-3',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <Spinner size="xl" color="red" />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  DOTS LOADER
// ════════════════════════════════════════════════════
// three bouncing dots — alternative loading style
export const DotsLoader = ({
  color     = 'red',
  size      = 'md',
  className = '',
}) => {
  const colorClasses = {
    red:  'bg-red-600',
    gray: 'bg-gray-400',
    white: 'bg-white',
  }

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  const dotClass = [
    'rounded-full animate-bounce',
    colorClasses[color]  ?? colorClasses.red,
    sizeClasses[size]    ?? sizeClasses.md,
  ].join(' ')

  return (
    <div
      className={[
        'flex items-center gap-1',
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label="Loading"
    >
      <span className={dotClass} style={{ animationDelay: '0ms' }} />
      <span className={dotClass} style={{ animationDelay: '150ms' }} />
      <span className={dotClass} style={{ animationDelay: '300ms' }} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}