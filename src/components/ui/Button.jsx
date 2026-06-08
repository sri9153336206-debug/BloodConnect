import { Loader2 } from 'lucide-react'

// ════════════════════════════════════════════════════
//  BUTTON VARIANTS CONFIG
// ════════════════════════════════════════════════════
const variants = {
  primary: [
    'bg-red-600 hover:bg-red-700 active:bg-red-800',
    'text-white',
    'border border-red-600 hover:border-red-700',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  outline: [
    'bg-transparent hover:bg-red-50 active:bg-red-100',
    'text-red-600',
    'border-2 border-red-600',
  ].join(' '),

  ghost: [
    'bg-transparent hover:bg-red-50 active:bg-red-100',
    'text-red-600',
    'border border-transparent',
  ].join(' '),

  secondary: [
    'bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
    'text-gray-700',
    'border border-gray-200 hover:border-gray-300',
  ].join(' '),

  danger: [
    'bg-red-500 hover:bg-red-600 active:bg-red-700',
    'text-white',
    'border border-red-500 hover:border-red-600',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  success: [
    'bg-green-600 hover:bg-green-700 active:bg-green-800',
    'text-white',
    'border border-green-600 hover:border-green-700',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  white: [
    'bg-white hover:bg-gray-50 active:bg-gray-100',
    'text-red-600',
    'border border-white',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  dark: [
    'bg-gray-900 hover:bg-gray-800 active:bg-gray-700',
    'text-white',
    'border border-gray-900',
    'shadow-sm hover:shadow-md',
  ].join(' '),
}

// ════════════════════════════════════════════════════
//  BUTTON SIZES CONFIG
// ════════════════════════════════════════════════════
const sizes = {
  xs:   'px-3 py-1.5 text-xs rounded-lg gap-1',
  sm:   'px-4 py-2 text-sm rounded-xl gap-1.5',
  md:   'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg:   'px-6 py-3 text-base rounded-xl gap-2',
  xl:   'px-8 py-4 text-lg rounded-2xl gap-2.5',
  icon: 'p-2.5 rounded-xl',
}

// ════════════════════════════════════════════════════
//  BUTTON COMPONENT
// ════════════════════════════════════════════════════
const Button = ({
  // content
  children,
  label,

  // style
  variant  = 'primary',
  size     = 'md',
  fullWidth = false,
  rounded  = false,

  // icons
  leftIcon,
  rightIcon,

  // state
  loading   = false,
  disabled  = false,

  // html attrs
  type      = 'button',
  className = '',
  onClick,

  // others
  ...rest
}) => {

  // ── Base Classes ─────────────────────────────────
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold',
    'transition-all duration-200 ease-in-out',
    'cursor-pointer',
    'select-none',
    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' ')

  // ── Variant Classes ───────────────────────────────
  const variantClasses = variants[variant] ?? variants.primary

  // ── Size Classes ──────────────────────────────────
  const sizeClasses = sizes[size] ?? sizes.md

  // ── Width Classes ─────────────────────────────────
  const widthClasses = fullWidth ? 'w-full' : ''

  // ── Border Radius Override ────────────────────────
  const radiusClasses = rounded ? '!rounded-full' : ''

  // ── Final Classes ─────────────────────────────────
  const finalClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    radiusClasses,
    className,
  ].filter(Boolean).join(' ')

  // ── Loader Size Map ───────────────────────────────
  const loaderSizes = {
    xs:   14,
    sm:   15,
    md:   16,
    lg:   18,
    xl:   20,
    icon: 16,
  }

  const loaderSize = loaderSizes[size] ?? 16

  // ── Render ───────────────────────────────────────
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={finalClasses}
      aria-label={label ?? (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...rest}
    >
      {/* Loading Spinner */}
      {loading && (
        <Loader2
          size={loaderSize}
          className="animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      )}

      {/* Left Icon (hidden when loading) */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Button Text */}
      {children && (
        <span className={size === 'icon' ? 'sr-only' : ''}>
          {children}
        </span>
      )}

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  )
}

export default Button

// ════════════════════════════════════════════════════
//  ICON BUTTON — square button with just an icon
// ════════════════════════════════════════════════════
export const IconButton = ({
  icon,
  label,
  variant   = 'ghost',
  size      = 'icon',
  className = '',
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      label={label}
      className={className}
      {...rest}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="sr-only">{label}</span>
    </Button>
  )
}

// ════════════════════════════════════════════════════
//  LINK BUTTON — looks like a link, acts like a button
// ════════════════════════════════════════════════════
export const LinkButton = ({
  children,
  className = '',
  onClick,
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1',
        'text-red-600 hover:text-red-700',
        'underline underline-offset-2',
        'font-medium text-sm',
        'transition-colors duration-200',
        'cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}

// ════════════════════════════════════════════════════
//  CALL BUTTON — red phone button for donor contact
// ════════════════════════════════════════════════════
export const CallButton = ({
  phone,
  size      = 'md',
  fullWidth = false,
  className = '',
}) => {
  return (
    <a
      href={`tel:${phone}`}
      className={[
        'inline-flex items-center justify-center gap-2',
        'bg-red-600 hover:bg-red-700 active:bg-red-800',
        'text-white font-semibold',
        'rounded-xl border border-red-600',
        'transition-all duration-200',
        'shadow-sm hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        size === 'sm' ? 'px-4 py-2 text-sm'   : '',
        size === 'md' ? 'px-5 py-2.5 text-sm' : '',
        size === 'lg' ? 'px-6 py-3 text-base' : '',
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Call ${phone}`}
    >
      📞 Call Now
    </a>
  )
}

// ════════════════════════════════════════════════════
//  MESSAGE BUTTON — WhatsApp message button
// ════════════════════════════════════════════════════
export const MessageButton = ({
  phone,
  name      = 'donor',
  size      = 'md',
  fullWidth = false,
  className = '',
}) => {
  const message = encodeURIComponent(
    `Hi ${name}, I found your profile on BloodConnect and need blood urgently. Can you please help?`
  )
  const whatsappUrl = `https://wa.me/91${phone}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center justify-center gap-2',
        'bg-white hover:bg-gray-50 active:bg-gray-100',
        'text-gray-700 font-semibold',
        'rounded-xl border-2 border-gray-200 hover:border-gray-300',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
        size === 'sm' ? 'px-4 py-2 text-sm'   : '',
        size === 'md' ? 'px-5 py-2.5 text-sm' : '',
        size === 'lg' ? 'px-6 py-3 text-base' : '',
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Message ${name} on WhatsApp`}
    >
      💬 Message
    </a>
  )
}