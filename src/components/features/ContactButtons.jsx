import { useState } from 'react'
import {
  Phone,
  MessageCircle,
  Share2,
  Copy,
  CheckCheck,
  Mail,
  MapPin,
  ExternalLink,
  Heart,
} from 'lucide-react'
import { useAuth }      from '../../context/AuthContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useUI }        from '../../context/UIContext.jsx'
import { formatPhone }  from '../../utils/validators.js'

// ════════════════════════════════════════════════════
//  CALL BUTTON
// ════════════════════════════════════════════════════
export const CallButton = ({
  phone,
  donorName = 'donor',
  size      = 'md',
  fullWidth = false,
  variant   = 'primary',
  className = '',
}) => {

  const { showInfo } = useUI()

  const handleClick = (e) => {
    if (!phone) {
      e.preventDefault()
      showInfo('Phone number not available.')
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  const variantClasses = {
    primary: [
      'bg-red-600 hover:bg-red-700 active:bg-red-800',
      'text-white border border-red-600',
      'shadow-sm hover:shadow-md',
    ].join(' '),
    outline: [
      'bg-white hover:bg-red-50',
      'text-red-600 border-2 border-red-600',
    ].join(' '),
    ghost: [
      'bg-red-50 hover:bg-red-100',
      'text-red-600 border border-red-100',
    ].join(' '),
  }

  return (
    <a
      href={phone ? `tel:${phone}` : undefined}
      onClick={handleClick}
      className={[
        'inline-flex items-center justify-center',
        'font-semibold rounded-xl',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        fullWidth ? 'w-full' : '',
        sizeClasses[size]    ?? sizeClasses.md,
        variantClasses[variant] ?? variantClasses.primary,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Call ${donorName} at ${formatPhone(phone)}`}
    >
      <Phone
        size={size === 'lg' ? 18 : 16}
        aria-hidden="true"
      />
      <span>Call Now</span>
    </a>
  )
}

// ════════════════════════════════════════════════════
//  WHATSAPP MESSAGE BUTTON
// ════════════════════════════════════════════════════
export const WhatsAppButton = ({
  phone,
  donorName = 'donor',
  bloodGroup = '',
  size      = 'md',
  fullWidth = false,
  variant   = 'outline',
  className = '',
}) => {

  const { showInfo } = useUI()

  const getMessage = () => {
    const base = `Hi ${donorName}, I found your profile on BloodConnect`
    const bg   = bloodGroup ? ` and urgently need ${bloodGroup} blood` : ''
    return encodeURIComponent(`${base}${bg}. Can you please help? 🙏`)
  }

  const whatsappUrl = phone
    ? `https://wa.me/91${phone}?text=${getMessage()}`
    : undefined

  const handleClick = (e) => {
    if (!phone) {
      e.preventDefault()
      showInfo('Phone number not available.')
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  const variantClasses = {
    primary: [
      'bg-green-500 hover:bg-green-600',
      'text-white border border-green-500',
      'shadow-sm hover:shadow-md',
    ].join(' '),
    outline: [
      'bg-white hover:bg-gray-50',
      'text-gray-700 border-2 border-gray-200',
      'hover:border-gray-300',
    ].join(' '),
    ghost: [
      'bg-gray-50 hover:bg-gray-100',
      'text-gray-700 border border-gray-100',
    ].join(' '),
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={[
        'inline-flex items-center justify-center',
        'font-semibold rounded-xl',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
        fullWidth ? 'w-full' : '',
        sizeClasses[size]       ?? sizeClasses.md,
        variantClasses[variant] ?? variantClasses.outline,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Message ${donorName} on WhatsApp`}
    >
      <MessageCircle
        size={size === 'lg' ? 18 : 16}
        aria-hidden="true"
      />
      <span>Message</span>
    </a>
  )
}

// ════════════════════════════════════════════════════
//  COPY PHONE BUTTON
// ════════════════════════════════════════════════════
export const CopyPhoneButton = ({
  phone,
  className = '',
}) => {

  const [copied, setCopied] = useState(false)
  const { showSuccess }     = useUI()

  const handleCopy = async () => {
    if (!phone) return
    try {
      await navigator.clipboard.writeText(phone)
      setCopied(true)
      showSuccess('Phone number copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showSuccess('Copy failed. Please copy manually.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={[
        'inline-flex items-center gap-1.5',
        'px-3 py-2 rounded-xl',
        'text-sm font-medium',
        'border border-gray-200',
        'transition-all duration-200',
        copied
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300',
        className,
      ].filter(Boolean).join(' ')}
      aria-label={copied ? 'Phone number copied' : 'Copy phone number'}
    >
      {copied
        ? <CheckCheck size={14} className="text-green-500" aria-hidden="true" />
        : <Copy      size={14} aria-hidden="true" />
      }
      <span>{copied ? 'Copied!' : formatPhone(phone)}</span>
    </button>
  )
}

// ════════════════════════════════════════════════════
//  SHARE DONOR BUTTON
// ════════════════════════════════════════════════════
export const ShareButton = ({
  donor,
  size      = 'md',
  className = '',
}) => {

  const [shared, setShared] = useState(false)
  const { showSuccess, showInfo } = useUI()

  const handleShare = async () => {
    const url  = `${window.location.origin}/donor/${donor?.id}`
    const text = `Found a blood donor on BloodConnect! ${donor?.name} (${donor?.bloodGroup}) in ${donor?.location}. Contact: ${donor?.phone}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'BloodConnect Donor', text, url })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        if (err.name !== 'AbortError') {
          showInfo('Sharing failed. Try copying the link instead.')
        }
      }
    } else {
      // fallback — copy link to clipboard
      try {
        await navigator.clipboard.writeText(url)
        showSuccess('Donor profile link copied to clipboard!')
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch {
        showInfo('Could not share. Please copy the URL manually.')
      }
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-11 h-11',
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={[
        'flex items-center justify-center rounded-xl',
        'border border-gray-200',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-gray-400',
        shared
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].filter(Boolean).join(' ')}
      aria-label="Share donor profile"
    >
      {shared
        ? <CheckCheck size={16} aria-hidden="true" />
        : <Share2     size={16} aria-hidden="true" />
      }
    </button>
  )
}

// ════════════════════════════════════════════════════
//  FAVORITE BUTTON
// ════════════════════════════════════════════════════
export const FavoriteButton = ({
  donorId,
  donorName = 'donor',
  size      = 'md',
  showLabel = false,
  className = '',
}) => {

  const { isLoggedIn }             = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showInfo }               = useUI()

  const isFav = isFavorite(donorId)

  const handleToggle = () => {
    if (!isLoggedIn) {
      showInfo('Please login to save favorites.')
      return
    }
    toggleFavorite(donorId)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-11 h-11',
  }

  const iconSizes = { sm: 15, md: 18, lg: 20 }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={[
        'flex items-center justify-center gap-1.5 rounded-xl',
        'border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-400',
        showLabel ? 'px-4 py-2.5' : '',
        !showLabel ? sizeClasses[size] ?? sizeClasses.md : '',
        isFav
          ? 'bg-red-50 text-red-500 border-red-200'
          : 'bg-white text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200',
        className,
      ].filter(Boolean).join(' ')}
      aria-pressed={isFav}
      aria-label={
        isFav
          ? `Remove ${donorName} from favorites`
          : `Add ${donorName} to favorites`
      }
    >
      <Heart
        size={iconSizes[size] ?? 18}
        className={[
          'transition-all duration-200',
          isFav ? 'fill-red-500 text-red-500' : '',
        ].join(' ')}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-sm font-semibold">
          {isFav ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}

// ════════════════════════════════════════════════════
//  EMAIL BUTTON
// ════════════════════════════════════════════════════
export const EmailButton = ({
  email,
  subject   = 'Blood Donation Request - BloodConnect',
  body      = '',
  size      = 'md',
  fullWidth = false,
  className = '',
}) => {

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <a
      href={mailtoUrl}
      className={[
        'inline-flex items-center justify-center',
        'font-semibold rounded-xl',
        'bg-blue-50 text-blue-600',
        'border border-blue-100',
        'hover:bg-blue-100 hover:border-blue-200',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-400',
        fullWidth ? 'w-full' : '',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Email ${email}`}
    >
      <Mail size={size === 'lg' ? 18 : 16} aria-hidden="true" />
      <span>Send Email</span>
    </a>
  )
}

// ════════════════════════════════════════════════════
//  DIRECTIONS BUTTON
// ════════════════════════════════════════════════════
export const DirectionsButton = ({
  location,
  size      = 'md',
  fullWidth = false,
  className = '',
}) => {

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location ?? '')}`

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center justify-center',
        'font-semibold rounded-xl',
        'bg-orange-50 text-orange-600',
        'border border-orange-100',
        'hover:bg-orange-100 hover:border-orange-200',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-orange-400',
        fullWidth ? 'w-full' : '',
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={`Get directions to ${location}`}
    >
      <MapPin     size={size === 'lg' ? 18 : 16} aria-hidden="true" />
      <span>Directions</span>
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  )
}

// ════════════════════════════════════════════════════
//  CONTACT BUTTONS GROUP
// ════════════════════════════════════════════════════
// main group used on DonorDetailsPage
const ContactButtons = ({
  donor,
  size      = 'md',
  layout    = 'row',
  showShare = true,
  showFav   = true,
  showCopy  = true,
  className = '',
}) => {

  if (!donor) return null

  const {
    id,
    name,
    phone,
    bloodGroup,
    location,
  } = donor

  return (
    <div className={[
      layout === 'col'
        ? 'flex flex-col gap-3'
        : 'flex flex-wrap gap-3',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Call */}
      <CallButton
        phone={phone}
        donorName={name}
        size={size}
        fullWidth={layout === 'col'}
      />

      {/* WhatsApp */}
      <WhatsAppButton
        phone={phone}
        donorName={name}
        bloodGroup={bloodGroup}
        size={size}
        fullWidth={layout === 'col'}
      />

      {/* Copy Phone */}
      {showCopy && (
        <CopyPhoneButton phone={phone} />
      )}

      {/* Share */}
      {showShare && (
        <ShareButton donor={donor} size={size} />
      )}

      {/* Favorite */}
      {showFav && (
        <FavoriteButton
          donorId={id}
          donorName={name}
          size={size}
          showLabel
        />
      )}

    </div>
  )
}

export default ContactButtons

// ════════════════════════════════════════════════════
//  COMPACT CONTACT ROW — for donor cards
// ════════════════════════════════════════════════════
export const CompactContactRow = ({
  donor,
  className = '',
}) => {

  if (!donor) return null

  return (
    <div
      className={[
        'flex items-center gap-2',
        className,
      ].filter(Boolean).join(' ')}
      onClick={e => e.stopPropagation()}
    >
      <CallButton
        phone={donor.phone}
        donorName={donor.name}
        size="sm"
        fullWidth
      />
      <WhatsAppButton
        phone={donor.phone}
        donorName={donor.name}
        bloodGroup={donor.bloodGroup}
        size="sm"
        fullWidth
      />
    </div>
  )
}

// ════════════════════════════════════════════════════
//  EMERGENCY CONTACT BANNER
// ════════════════════════════════════════════════════
// urgent red banner with big call button
export const EmergencyContactBanner = ({
  phone,
  donorName = 'donor',
  className = '',
}) => {

  return (
    <div className={[
      'bg-red-600 rounded-2xl p-5',
      'flex flex-col sm:flex-row items-center justify-between gap-4',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Left */}
      <div>
        <p className="text-white font-bold text-lg">
          Emergency Contact
        </p>
        <p className="text-red-100 text-sm mt-0.5">
          Call {donorName} directly for urgent blood donation
        </p>
      </div>

      {/* Call Button */}
      <a
        href={`tel:${phone}`}
        className={[
          'inline-flex items-center gap-2',
          'px-6 py-3 rounded-xl',
          'bg-white text-red-600',
          'font-bold text-base',
          'shadow-lg hover:shadow-xl',
          'hover:bg-red-50',
          'transition-all duration-200',
          'whitespace-nowrap flex-shrink-0',
          'animate-pulse-slow',
        ].join(' ')}
        aria-label={`Emergency call ${donorName}`}
      >
        <Phone size={20} aria-hidden="true" />
        {formatPhone(phone)}
      </a>

    </div>
  )
}