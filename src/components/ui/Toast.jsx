import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react'

// ════════════════════════════════════════════════════
//  TOAST CONFIG
// ════════════════════════════════════════════════════
const toastConfig = {
  success: {
    icon:       <CheckCircle2 size={18} />,
    iconColor:  'text-green-500',
    borderColor: 'border-l-green-500',
    bgColor:    'bg-white',
    titleColor: 'text-green-700',
    label:      'Success',
  },
  error: {
    icon:       <XCircle size={18} />,
    iconColor:  'text-red-500',
    borderColor: 'border-l-red-500',
    bgColor:    'bg-white',
    titleColor: 'text-red-700',
    label:      'Error',
  },
  info: {
    icon:       <Info size={18} />,
    iconColor:  'text-blue-500',
    borderColor: 'border-l-blue-500',
    bgColor:    'bg-white',
    titleColor: 'text-blue-700',
    label:      'Info',
  },
  warning: {
    icon:       <AlertTriangle size={18} />,
    iconColor:  'text-yellow-500',
    borderColor: 'border-l-yellow-500',
    bgColor:    'bg-white',
    titleColor: 'text-yellow-700',
    label:      'Warning',
  },
}

// ════════════════════════════════════════════════════
//  SINGLE TOAST COMPONENT
// ════════════════════════════════════════════════════
const Toast = ({
  // content
  message,
  title,
  type      = 'success',

  // timing
  duration  = 3000,

  // actions
  onClose,

  // style
  className = '',
}) => {

  // ── Visible State For Exit Animation ─────────────
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  // ── Progress Bar Width ────────────────────────────
  const [progress, setProgress] = useState(100)

  // ── Get Config ────────────────────────────────────
  const config = toastConfig[type] ?? toastConfig.success

  // ── Entrance Animation ────────────────────────────
  useEffect(() => {
    // small delay so entrance animation triggers
    const enterTimer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(enterTimer)
  }, [])

  // ── Progress Bar Timer ────────────────────────────
  useEffect(() => {
    if (!duration) return

    const interval = 50
    const step     = (interval / duration) * 100
    let   current  = 100

    const timer = setInterval(() => {
      current -= step
      if (current <= 0) {
        clearInterval(timer)
        setProgress(0)
      } else {
        setProgress(current)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [duration])

  // ── Handle Close With Exit Animation ─────────────
  const handleClose = () => {
    setExiting(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  // ── Auto Close ────────────────────────────────────
  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(() => {
      handleClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  // ── Dynamic Classes ───────────────────────────────
  const toastClasses = [
    // base
    'relative w-full max-w-sm',
    'rounded-xl shadow-lg',
    'border border-gray-100',
    'border-l-4',
    'overflow-hidden',
    'pointer-events-auto',
    // colors
    config.bgColor,
    config.borderColor,
    // animation
    'transition-all duration-300 ease-out',
    visible && !exiting
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 translate-x-full',
    className,
  ].filter(Boolean).join(' ')

  // ── Render ───────────────────────────────────────
  return (
    <div
      className={toastClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Main Content */}
      <div className="flex items-start gap-3 p-4">

        {/* Icon */}
        <div className={[
          'flex-shrink-0 mt-0.5',
          config.iconColor,
        ].join(' ')}>
          {config.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={[
            'text-xs font-bold uppercase tracking-wide',
            config.titleColor,
          ].join(' ')}>
            {title ?? config.label}
          </p>
          {/* Message */}
          <p className="text-sm text-gray-600 mt-0.5 leading-snug">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className={[
            'flex-shrink-0',
            'w-6 h-6 rounded-full',
            'flex items-center justify-center',
            'text-gray-400 hover:text-gray-600',
            'hover:bg-gray-100',
            'transition-colors duration-150',
            'focus:outline-none',
            '-mt-0.5 -mr-0.5',
          ].join(' ')}
          aria-label="Close notification"
        >
          <X size={14} />
        </button>

      </div>

      {/* Progress Bar */}
      {duration && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
          <div
            className={[
              'h-full transition-none',
              type === 'success' ? 'bg-green-500'  : '',
              type === 'error'   ? 'bg-red-500'    : '',
              type === 'info'    ? 'bg-blue-500'   : '',
              type === 'warning' ? 'bg-yellow-500' : '',
            ].filter(Boolean).join(' ')}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

    </div>
  )
}

export default Toast

// ════════════════════════════════════════════════════
//  TOAST CONTAINER
// ════════════════════════════════════════════════════
// renders all active toasts — place once in App.jsx
export const ToastContainer = ({
  toasts    = [],
  onRemove,
  position  = 'top-right',
}) => {

  // ── Position Classes ──────────────────────────────
  const positionClasses = {
    'top-right':    'top-4 right-4 items-end',
    'top-left':     'top-4 left-4 items-start',
    'top-center':   'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left':  'bottom-4 left-4 items-start',
    'bottom-center':'bottom-4 left-1/2 -translate-x-1/2 items-center',
  }

  const containerClasses = [
    'fixed z-50',
    'flex flex-col gap-2',
    'pointer-events-none',
    'w-full max-w-sm',
    positionClasses[position] ?? positionClasses['top-right'],
  ].join(' ')

  if (!toasts || toasts.length === 0) return null

  return (
    <div
      className={containerClasses}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          title={toast.title}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove?.(toast.id)}
        />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  SIMPLE TOAST VARIANTS (pre-configured)
// ════════════════════════════════════════════════════

export const SuccessToast = ({ message, onClose, duration }) => (
  <Toast
    message={message}
    type="success"
    onClose={onClose}
    duration={duration}
  />
)

export const ErrorToast = ({ message, onClose, duration }) => (
  <Toast
    message={message}
    type="error"
    onClose={onClose}
    duration={duration ?? 4000}
  />
)

export const InfoToast = ({ message, onClose, duration }) => (
  <Toast
    message={message}
    type="info"
    onClose={onClose}
    duration={duration}
  />
)

export const WarningToast = ({ message, onClose, duration }) => (
  <Toast
    message={message}
    type="warning"
    onClose={onClose}
    duration={duration}
  />
)