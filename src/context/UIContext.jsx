import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react'
import { TOAST_TYPES } from '../constants/index.js'

// ── Create Context ───────────────────────────────────
const UIContext = createContext(null)

// ── Default Toast Duration ───────────────────────────
const DEFAULT_TOAST_DURATION = 3000

// ════════════════════════════════════════════════════
//  UI PROVIDER
// ════════════════════════════════════════════════════
export const UIProvider = ({ children }) => {

  // ── Toast State ──────────────────────────────────
  const [toasts, setToasts]           = useState([])

  // ── Global Loading State ─────────────────────────
  const [isLoading, setIsLoading]     = useState(false)

  // ── Modal State ──────────────────────────────────
  const [modal, setModal]             = useState({
    isOpen:    false,
    title:     '',
    message:   '',
    onConfirm: null,
    onCancel:  null,
    type:      'info',
    confirmLabel: 'Confirm',
    cancelLabel:  'Cancel',
  })

  // ── Mobile Menu State ────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ── Search Drawer State (mobile) ─────────────────
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // ── Toast ID Ref ─────────────────────────────────
  const toastIdRef = useRef(0)

  // ════════════════════════════════════════════════
  //  TOAST ACTIONS
  // ════════════════════════════════════════════════

  // ── Show Toast ───────────────────────────────────
  const showToast = useCallback((
    message,
    type     = TOAST_TYPES.SUCCESS,
    duration = DEFAULT_TOAST_DURATION
  ) => {
    toastIdRef.current += 1
    const id = toastIdRef.current

    setToasts(prev => [
      ...prev,
      { id, message, type, duration },
    ])

    // auto remove after duration + exit animation time
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration + 400)

    return id
  }, [])

  // ── Remove Toast By ID ───────────────────────────
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Clear All Toasts ─────────────────────────────
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // ── Toast Shorthand Helpers ──────────────────────
  const showSuccess = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.SUCCESS, duration)
  }, [showToast])

  const showError = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.ERROR, duration ?? 4000)
  }, [showToast])

  const showInfo = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.INFO, duration)
  }, [showToast])

  const showWarning = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.WARNING, duration)
  }, [showToast])

  // ════════════════════════════════════════════════
  //  MODAL ACTIONS
  // ════════════════════════════════════════════════

  // ── Open Confirm Modal ───────────────────────────
  const openModal = useCallback(({
    title        = 'Are you sure?',
    message      = '',
    onConfirm    = null,
    onCancel     = null,
    type         = 'info',
    confirmLabel = 'Confirm',
    cancelLabel  = 'Cancel',
  }) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
      type,
      confirmLabel,
      cancelLabel,
    })
  }, [])

  // ── Close Modal ──────────────────────────────────
  const closeModal = useCallback(() => {
    setModal(prev => ({
      ...prev,
      isOpen:    false,
      onConfirm: null,
      onCancel:  null,
    }))
  }, [])

  // ── Confirm Modal Action ─────────────────────────
  const confirmModal = useCallback(() => {
    if (modal.onConfirm) modal.onConfirm()
    closeModal()
  }, [modal, closeModal])

  // ── Cancel Modal Action ──────────────────────────
  const cancelModal = useCallback(() => {
    if (modal.onCancel) modal.onCancel()
    closeModal()
  }, [modal, closeModal])

  // ── Open Delete Confirm Modal ────────────────────
  // shorthand for common delete confirmation
  const openDeleteModal = useCallback(({
    itemName  = 'this item',
    onConfirm = null,
  }) => {
    openModal({
      title:        'Delete ' + itemName + '?',
      message:      'This action cannot be undone. Are you sure you want to delete ' + itemName + '?',
      onConfirm,
      type:         'danger',
      confirmLabel: 'Yes, Delete',
      cancelLabel:  'Cancel',
    })
  }, [openModal])

  // ── Open Logout Confirm Modal ────────────────────
  const openLogoutModal = useCallback((onConfirm) => {
    openModal({
      title:        'Logout?',
      message:      'Are you sure you want to logout from BloodConnect?',
      onConfirm,
      type:         'warning',
      confirmLabel: 'Yes, Logout',
      cancelLabel:  'Stay Logged In',
    })
  }, [openModal])

  // ════════════════════════════════════════════════
  //  NAVIGATION ACTIONS
  // ════════════════════════════════════════════════

  // ── Toggle Mobile Menu ───────────────────────────
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  // ── Close Mobile Menu ────────────────────────────
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // ── Toggle Filter Drawer ─────────────────────────
  const toggleFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(prev => !prev)
  }, [])

  // ── Close Filter Drawer ──────────────────────────
  const closeFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false)
  }, [])

  // ════════════════════════════════════════════════
  //  GLOBAL LOADING ACTIONS
  // ════════════════════════════════════════════════

  // ── Start Loading ────────────────────────────────
  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  // ── Stop Loading ─────────────────────────────────
  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  // ── Context Value ────────────────────────────────
  const value = {
    // toast state
    toasts,
    // toast actions
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    // modal state
    modal,
    // modal actions
    openModal,
    closeModal,
    confirmModal,
    cancelModal,
    openDeleteModal,
    openLogoutModal,
    // navigation state
    isMobileMenuOpen,
    isFilterDrawerOpen,
    // navigation actions
    toggleMobileMenu,
    closeMobileMenu,
    toggleFilterDrawer,
    closeFilterDrawer,
    // global loading
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading,
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

// ════════════════════════════════════════════════════
//  CUSTOM HOOK
// ════════════════════════════════════════════════════
export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used inside UIProvider')
  }
  return context
}