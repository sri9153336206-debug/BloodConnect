import {
  SearchX,
  Heart,
  UserX,
  Droplets,
  FileX,
  WifiOff,
  ShieldX,
  Star,
  Bell,
  Inbox,
} from 'lucide-react'
import Button from './Button.jsx'

// ════════════════════════════════════════════════════
//  EMPTY STATE CONFIG
// ════════════════════════════════════════════════════
const emptyStateConfig = {
  // no donors found after search/filter
  noDonors: {
    icon:        <SearchX size={40} />,
    iconBg:      'bg-red-50',
    iconColor:   'text-red-400',
    title:       'No donors found',
    description: 'Try adjusting your filters or search with a different blood group or location.',
  },
  // no favorites saved
  noFavorites: {
    icon:        <Heart size={40} />,
    iconBg:      'bg-pink-50',
    iconColor:   'text-pink-400',
    title:       'No favorites yet',
    description: 'Save donors you want to contact quickly by tapping the heart icon on their profile.',
  },
  // no search results
  noResults: {
    icon:        <SearchX size={40} />,
    iconBg:      'bg-gray-50',
    iconColor:   'text-gray-400',
    title:       'No results found',
    description: 'We could not find anything matching your search. Try different keywords.',
  },
  // user not logged in
  notLoggedIn: {
    icon:        <ShieldX size={40} />,
    iconBg:      'bg-orange-50',
    iconColor:   'text-orange-400',
    title:       'Login required',
    description: 'Please login to your account to access this feature.',
  },
  // no user profile
  noProfile: {
    icon:        <UserX size={40} />,
    iconBg:      'bg-gray-50',
    iconColor:   'text-gray-400',
    title:       'Profile not found',
    description: 'We could not load your profile. Please try logging in again.',
  },
  // no donations history
  noDonations: {
    icon:        <Droplets size={40} />,
    iconBg:      'bg-red-50',
    iconColor:   'text-red-400',
    title:       'No donations yet',
    description: 'You have not made any blood donations yet. Register as a donor to get started.',
  },
  // no data / generic
  noData: {
    icon:        <FileX size={40} />,
    iconBg:      'bg-gray-50',
    iconColor:   'text-gray-400',
    title:       'No data available',
    description: 'There is nothing to show here right now. Please check back later.',
  },
  // network error
  networkError: {
    icon:        <WifiOff size={40} />,
    iconBg:      'bg-gray-50',
    iconColor:   'text-gray-400',
    title:       'Connection error',
    description: 'Unable to load data. Please check your internet connection and try again.',
  },
  // no notifications
  noNotifications: {
    icon:        <Bell size={40} />,
    iconBg:      'bg-blue-50',
    iconColor:   'text-blue-400',
    title:       'No notifications',
    description: 'You are all caught up! No new notifications at the moment.',
  },
  // empty inbox
  noMessages: {
    icon:        <Inbox size={40} />,
    iconBg:      'bg-purple-50',
    iconColor:   'text-purple-400',
    title:       'No messages',
    description: 'Your inbox is empty. Contact donors to start a conversation.',
  },
  // no starred items
  noStarred: {
    icon:        <Star size={40} />,
    iconBg:      'bg-yellow-50',
    iconColor:   'text-yellow-400',
    title:       'Nothing starred',
    description: 'You have not starred anything yet.',
  },
}

// ════════════════════════════════════════════════════
//  MAIN EMPTY STATE COMPONENT
// ════════════════════════════════════════════════════
const EmptyState = ({
  // preset type
  type,

  // custom override
  icon,
  iconBg,
  iconColor,
  title,
  description,

  // action button
  actionLabel,
  onAction,
  actionVariant = 'primary',

  // secondary action
  secondaryLabel,
  onSecondary,

  // style
  size      = 'md',
  className = '',
  compact   = false,
}) => {

  // ── Merge Config With Custom Props ────────────────
  const config   = type ? (emptyStateConfig[type] ?? emptyStateConfig.noData) : {}
  const finalIcon      = icon        ?? config.icon
  const finalIconBg    = iconBg      ?? config.iconBg    ?? 'bg-gray-50'
  const finalIconColor = iconColor   ?? config.iconColor ?? 'text-gray-400'
  const finalTitle     = title       ?? config.title     ?? 'Nothing here'
  const finalDesc      = description ?? config.description

  // ── Size Classes ──────────────────────────────────
  const sizeConfig = {
    sm: {
      wrapper:  compact ? 'py-6' : 'py-10',
      iconBox:  'w-14 h-14',
      title:    'text-base',
      desc:     'text-sm',
    },
    md: {
      wrapper:  compact ? 'py-8' : 'py-16',
      iconBox:  'w-20 h-20',
      title:    'text-lg',
      desc:     'text-sm',
    },
    lg: {
      wrapper:  compact ? 'py-10' : 'py-20',
      iconBox:  'w-24 h-24',
      title:    'text-xl',
      desc:     'text-base',
    },
  }

  const sc = sizeConfig[size] ?? sizeConfig.md

  // ── Render ───────────────────────────────────────
  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'text-center px-4',
        'animate-fade-in',
        sc.wrapper,
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label={finalTitle}
    >

      {/* Icon Box */}
      {finalIcon && (
        <div className={[
          'flex items-center justify-center',
          'rounded-full mb-5 flex-shrink-0',
          finalIconBg,
          finalIconColor,
          sc.iconBox,
        ].join(' ')}>
          {finalIcon}
        </div>
      )}

      {/* Title */}
      <h3 className={[
        'font-bold text-gray-800 mb-2',
        sc.title,
      ].join(' ')}>
        {finalTitle}
      </h3>

      {/* Description */}
      {finalDesc && (
        <p className={[
          'text-gray-500 max-w-sm leading-relaxed mb-6',
          sc.desc,
        ].join(' ')}>
          {finalDesc}
        </p>
      )}

      {/* Action Buttons */}
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* Primary Action */}
          {actionLabel && onAction && (
            <Button
              variant={actionVariant}
              size="md"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}

          {/* Secondary Action */}
          {secondaryLabel && onSecondary && (
            <Button
              variant="ghost"
              size="md"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </Button>
          )}

        </div>
      )}

    </div>
  )
}

export default EmptyState

// ════════════════════════════════════════════════════
//  PRE-CONFIGURED EMPTY STATES
// ════════════════════════════════════════════════════

// ── No Donors Found ──────────────────────────────────
export const NoDonorsFound = ({
  onReset,
  onRegister,
}) => (
  <EmptyState
    type="noDonors"
    actionLabel="Reset Filters"
    onAction={onReset}
    actionVariant="outline"
    secondaryLabel="Become a Donor"
    onSecondary={onRegister}
  />
)

// ── No Favorites ─────────────────────────────────────
export const NoFavorites = ({ onFindDonors }) => (
  <EmptyState
    type="noFavorites"
    actionLabel="Find Donors"
    onAction={onFindDonors}
    actionVariant="primary"
  />
)

// ── Not Logged In ────────────────────────────────────
export const NotLoggedIn = ({ onLogin, onSignup }) => (
  <EmptyState
    type="notLoggedIn"
    actionLabel="Login"
    onAction={onLogin}
    secondaryLabel="Create Account"
    onSecondary={onSignup}
  />
)

// ── Network Error ────────────────────────────────────
export const NetworkError = ({ onRetry }) => (
  <EmptyState
    type="networkError"
    actionLabel="Try Again"
    onAction={onRetry}
    actionVariant="outline"
  />
)

// ── No Donations ─────────────────────────────────────
export const NoDonations = ({ onRegister }) => (
  <EmptyState
    type="noDonations"
    actionLabel="Register as Donor"
    onAction={onRegister}
    actionVariant="primary"
  />
)

// ── No Search Results ────────────────────────────────
export const NoSearchResults = ({ query, onClear }) => (
  <EmptyState
    type="noResults"
    title={`No results for "${query}"`}
    description="Try searching with different keywords or check for typos."
    actionLabel="Clear Search"
    onAction={onClear}
    actionVariant="outline"
  />
)

// ════════════════════════════════════════════════════
//  FILTER EMPTY STATE
// ════════════════════════════════════════════════════
// special empty state showing active filters
export const FilterEmptyState = ({
  filters,
  onReset,
  onRegister,
}) => {

  // ── Build Active Filter Tags ──────────────────────
  const activeTags = []
  if (filters?.bloodGroup)   activeTags.push(filters.bloodGroup)
  if (filters?.location)     activeTags.push(filters.location)
  if (filters?.availableOnly) activeTags.push('Available only')

  return (
    <div className={[
      'flex flex-col items-center justify-center',
      'text-center px-4 py-16',
      'animate-fade-in',
    ].join(' ')}>

      {/* Icon */}
      <div className={[
        'w-20 h-20 rounded-full',
        'bg-red-50 text-red-400',
        'flex items-center justify-center',
        'mb-5',
      ].join(' ')}>
        <SearchX size={40} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        No donors match your filters
      </h3>

      {/* Active Filters */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {activeTags.map(tag => (
            <span
              key={tag}
              className={[
                'px-3 py-1 rounded-full',
                'bg-red-50 text-red-600',
                'text-xs font-semibold',
                'border border-red-100',
              ].join(' ')}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
        No donors are currently available with the selected filters.
        Try broadening your search or check back later.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={onReset}
        >
          Reset Filters
        </Button>
        {onRegister && (
          <Button
            variant="primary"
            size="md"
            onClick={onRegister}
          >
            Become a Donor
          </Button>
        )}
      </div>

    </div>
  )
}

// ════════════════════════════════════════════════════
//  ERROR STATE
// ════════════════════════════════════════════════════
// shown when an API call fails
export const ErrorState = ({
  message   = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}) => (
  <div
    className={[
      'flex flex-col items-center justify-center',
      'text-center px-4 py-16',
      'animate-fade-in',
      className,
    ].filter(Boolean).join(' ')}
  >
    {/* Icon */}
    <div className={[
      'w-20 h-20 rounded-full',
      'bg-red-50 text-red-400',
      'flex items-center justify-center mb-5',
    ].join(' ')}>
      <WifiOff size={40} />
    </div>

    {/* Title */}
    <h3 className="text-lg font-bold text-gray-800 mb-2">
      Something went wrong
    </h3>

    {/* Message */}
    <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
      {message}
    </p>

    {/* Retry */}
    {onRetry && (
      <Button
        variant="outline"
        size="md"
        onClick={onRetry}
      >
        Try Again
      </Button>
    )}
  </div>
)