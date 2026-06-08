import { useEffect, useCallback, useRef } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  LogOut,
} from 'lucide-react'
import Button from './Button.jsx'
import { useUI } from '../../context/UIContext.jsx'

// ════════════════════════════════════════════════════
//  MODAL OVERLAY
// ════════════════════════════════════════════════════
const ModalOverlay = ({ onClick }) => (
  <div
    className={[
      'fixed inset-0 z-40',
      'bg-black/50 backdrop-blur-sm',
      'animate-fade-in',
    ].join(' ')}
    onClick={onClick}
    aria-hidden="true"
  />
)

// ════════════════════════════════════════════════════
//  MODAL ICON CONFIG
// ════════════════════════════════════════════════════
const modalIcons = {
  info: {
    icon:       <Info size={24} />,
    iconBg:     'bg-blue-100',
    iconColor:  'text-blue-600',
    btnVariant: 'primary',
  },
  success: {
    icon:       <CheckCircle2 size={24} />,
    iconBg:     'bg-green-100',
    iconColor:  'text-green-600',
    btnVariant: 'success',
  },
  warning: {
    icon:       <AlertTriangle size={24} />,
    iconBg:     'bg-yellow-100',
    iconColor:  'text-yellow-600',
    btnVariant: 'primary',
  },
  danger: {
    icon:       <Trash2 size={24} />,
    iconBg:     'bg-red-100',
    iconColor:  'text-red-600',
    btnVariant: 'danger',
  },
  logout: {
    icon:       <LogOut size={24} />,
    iconBg:     'bg-orange-100',
    iconColor:  'text-orange-600',
    btnVariant: 'primary',
  },
}

// ════════════════════════════════════════════════════
//  MAIN MODAL COMPONENT
// ════════════════════════════════════════════════════
const Modal = ({
  // visibility
  isOpen        = false,

  // content
  title         = '',
  message       = '',
  children,

  // type
  type          = 'info',

  // actions
  onConfirm,
  onCancel,
  onClose,

  // labels
  confirmLabel  = 'Confirm',
  cancelLabel   = 'Cancel',

  // options
  showCancel    = true,
  showClose     = true,
  closeOnOverlay = true,
  loading       = false,

  // size
  size          = 'sm',

  // style
  className     = '',
}) => {

  // ── Refs ─────────────────────────────────────────
  const modalRef        = useRef(null)
  const firstFocusRef   = useRef(null)

  // ── Size Classes ──────────────────────────────────
  const sizeClasses = {
    xs:  'max-w-xs',
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  // ── Get Icon Config ───────────────────────────────
  const iconConfig = modalIcons[type] ?? modalIcons.info

  // ── Handle Close ──────────────────────────────────
  const handleClose = useCallback(() => {
    if (onClose)  onClose()
    if (onCancel) onCancel()
  }, [onClose, onCancel])

  // ── Handle Overlay Click ──────────────────────────
  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlay) handleClose()
  }, [closeOnOverlay, handleClose])

  // ── Handle Confirm ────────────────────────────────
  const handleConfirm = useCallback(() => {
    if (onConfirm) onConfirm()
  }, [onConfirm])

  // ── Keyboard Handler ──────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      // close on Escape
      if (e.key === 'Escape') handleClose()

      // trap focus inside modal
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last  = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // ── Lock Body Scroll When Open ────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // focus first focusable element
      setTimeout(() => firstFocusRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ── Do Not Render If Closed ───────────────────────
  if (!isOpen) return null

  // ── Render ───────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <ModalOverlay onClick={handleOverlayClick} />

      {/* Modal Container */}
      <div
        className={[
          'fixed inset-0 z-50',
          'flex items-center justify-center',
          'p-4',
          'pointer-events-none',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={message ? 'modal-message' : undefined}
      >
        {/* Modal Box */}
        <div
          ref={modalRef}
          className={[
            'relative w-full pointer-events-auto',
            'bg-white rounded-2xl shadow-xl',
            'border border-gray-100',
            'animate-scale-in',
            sizeClasses[size] ?? sizeClasses.sm,
            className,
          ].filter(Boolean).join(' ')}
        >

          {/* Close Button */}
          {showClose && (
            <button
              type="button"
              onClick={handleClose}
              className={[
                'absolute top-4 right-4',
                'w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'text-gray-400 hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-gray-300',
                'z-10',
              ].join(' ')}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}

          {/* Modal Content */}
          <div className="p-6">

            {/* Icon */}
            {type && !children && (
              <div className="flex justify-center mb-4">
                <div className={[
                  'w-14 h-14 rounded-full',
                  'flex items-center justify-center',
                  'flex-shrink-0',
                  iconConfig.iconBg,
                  iconConfig.iconColor,
                ].join(' ')}>
                  {iconConfig.icon}
                </div>
              </div>
            )}

            {/* Title */}
            {title && (
              <h2
                id="modal-title"
                className={[
                  'font-bold text-gray-900 text-center',
                  children ? 'text-xl mb-4' : 'text-lg mb-2',
                ].join(' ')}
              >
                {title}
              </h2>
            )}

            {/* Message */}
            {message && !children && (
              <p
                id="modal-message"
                className="text-sm text-gray-500 text-center leading-relaxed mb-6"
              >
                {message}
              </p>
            )}

            {/* Custom Children Content */}
            {children && (
              <div className="mb-6">
                {children}
              </div>
            )}

            {/* Action Buttons */}
            {(onConfirm || onCancel || onClose) && !children && (
              <div className="flex flex-col-reverse sm:flex-row gap-3">

                {/* Cancel Button */}
                {showCancel && (
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={handleClose}
                    disabled={loading}
                  >
                    {cancelLabel}
                  </Button>
                )}

                {/* Confirm Button */}
                {onConfirm && (
                  <Button
                    ref={firstFocusRef}
                    variant={iconConfig.btnVariant}
                    size="md"
                    fullWidth
                    onClick={handleConfirm}
                    loading={loading}
                  >
                    {confirmLabel}
                  </Button>
                )}

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default Modal

// ════════════════════════════════════════════════════
//  CONFIRM MODAL
// ════════════════════════════════════════════════════
// pre-configured modal for confirmations
export const ConfirmModal = ({
  isOpen,
  title        = 'Are you sure?',
  message      = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  type         = 'warning',
  loading      = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      message={message}
      type={type}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      loading={loading}
      size="sm"
    />
  )
}

// ════════════════════════════════════════════════════
//  DELETE MODAL
// ════════════════════════════════════════════════════
// pre-configured modal for delete confirmations
export const DeleteModal = ({
  isOpen,
  itemName     = 'this item',
  onConfirm,
  onCancel,
  loading      = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={`Delete ${itemName}?`}
      message={`This action cannot be undone. Are you sure you want to delete ${itemName}?`}
      type="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Yes, Delete"
      cancelLabel="Cancel"
      loading={loading}
      size="sm"
    />
  )
}

// ════════════════════════════════════════════════════
//  LOGOUT MODAL
// ════════════════════════════════════════════════════
// pre-configured modal for logout confirmation
export const LogoutModal = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Logout?"
      message="Are you sure you want to logout from BloodConnect?"
      type="logout"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Yes, Logout"
      cancelLabel="Stay Logged In"
      size="sm"
    />
  )
}

// ════════════════════════════════════════════════════
//  DRAWER MODAL — slides in from bottom on mobile
// ════════════════════════════════════════════════════
export const DrawerModal = ({
  isOpen,
  onClose,
  title,
  children,
  size      = 'full',
}) => {

  // ── Lock Scroll ───────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Keyboard Close ────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm:   'max-h-[40vh]',
    md:   'max-h-[60vh]',
    lg:   'max-h-[80vh]',
    full: 'max-h-[90vh]',
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white rounded-t-3xl shadow-xl',
          'animate-slide-up',
          'overflow-hidden flex flex-col',
          sizeClasses[size] ?? sizeClasses.full,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-bold text-gray-900 text-lg">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className={[
                'w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'text-gray-400 hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors duration-150',
                'focus:outline-none',
              ].join(' ')}
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </>
  )
}

// ════════════════════════════════════════════════════
//  GLOBAL MODAL RENDERER
// ════════════════════════════════════════════════════
// reads from UIContext and renders the active modal
// place this once in App.jsx
export const GlobalModal = () => {
  const { modal, confirmModal, cancelModal } = useUI()

  return (
    <Modal
      isOpen={modal?.isOpen ?? false}
      title={modal?.title}
      message={modal?.message}
      type={modal?.type ?? 'info'}
      onConfirm={confirmModal}
      onCancel={cancelModal}
      confirmLabel={modal?.confirmLabel}
      cancelLabel={modal?.cancelLabel}
    />
  )
}