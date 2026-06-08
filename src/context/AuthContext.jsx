import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import {
  loginUser,
  registerUser,
  updateUser,
  changePassword,
  deleteUser,
  initializeStorage,
  getUserById,
  loginWithGoogle,
} from '../services/mockApi.js'
import {
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
} from '../utils/storage.js'
import { auth, isFirebaseEnabled } from '../services/firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// ── Create Context ───────────────────────────────────
const AuthContext = createContext(null)

// ════════════════════════════════════════════════════
//  AUTH PROVIDER
// ════════════════════════════════════════════════════
export const AuthProvider = ({ children }) => {

  // ── State ────────────────────────────────────────
  const [currentUser, setCurrentUserState] = useState(null)
  const [loading, setLoading]              = useState(true)
  const [authError, setAuthError]          = useState(null)

  // ── Ref to skip onAuthStateChanged during signup/login ──
  // When we are actively registering or logging in, we handle
  // setting currentUser ourselves. The onAuthStateChanged
  // listener fires right after Firebase Auth creates the account,
  // but BEFORE we write the Firestore profile doc.
  // Without this flag it clears currentUser → redirect to /login.
  const isPendingAuthRef = React.useRef(false)

  // ── Initialize App On Mount ──────────────────────
  // seed database / localStorage with JSON data if empty
  // then restore logged-in user from Firebase Auth or localStorage
  useEffect(() => {
    initializeStorage().catch(error => {
      console.warn('[Auth] Failed to initialize storage:', error)
    })

    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        // Skip if we are mid-login/signup — we handle state ourselves there
        if (isPendingAuthRef.current) return

        if (firebaseUser) {
          try {
            // Retry up to 3 times with 500ms delay to handle Firestore write lag
            let profile = null
            for (let i = 0; i < 3; i++) {
              try {
                profile = await getUserById(firebaseUser.uid)
                break
              } catch {
                if (i < 2) await new Promise(r => setTimeout(r, 500))
              }
            }
            if (profile) {
              setCurrentUserState(profile)
              setCurrentUser(profile)
            } else {
              setCurrentUserState(null)
              removeCurrentUser()
            }
          } catch (error) {
            console.error('[Auth] Failed to restore Firebase session:', error)
            setCurrentUserState(null)
            removeCurrentUser()
          }
        } else {
          setCurrentUserState(null)
          removeCurrentUser()
        }
        setLoading(false)
      })
      return () => unsubscribe()
    } else {
      try {
        const savedUser = getCurrentUser()
        if (savedUser) {
          setCurrentUserState(savedUser)
        }
      } catch (error) {
        console.warn('[Auth] Failed to restore local session:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  // ── Clear Error ──────────────────────────────────
  const clearError = useCallback(() => {
    setAuthError(null)
  }, [])

  // ── Login ────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    isPendingAuthRef.current = true
    setLoading(true)
    setAuthError(null)
    try {
      const user = await loginUser(email, password)
      setCurrentUserState(user)
      setCurrentUser(user)
      return user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      isPendingAuthRef.current = false
      setLoading(false)
    }
  }, [])

  // ── Google Login ─────────────────────────────────
  const googleLogin = useCallback(async () => {
    isPendingAuthRef.current = true
    setLoading(true)
    setAuthError(null)
    try {
      const user = await loginWithGoogle()
      setCurrentUserState(user)
      setCurrentUser(user)
      return user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      isPendingAuthRef.current = false
      setLoading(false)
    }
  }, [])

  // ── Signup ──────────────────────────────────────
  const signup = useCallback(async (userData) => {
    isPendingAuthRef.current = true
    setLoading(true)
    setAuthError(null)
    try {
      const user = await registerUser(userData)
      setCurrentUserState(user)
      setCurrentUser(user)
      return user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      isPendingAuthRef.current = false
      setLoading(false)
    }
  }, [])

  // ── Logout ───────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      if (isFirebaseEnabled && auth) {
        await signOut(auth)
      }
    } catch (error) {
      console.error('[Auth] Firebase logout error:', error)
    } finally {
      setCurrentUserState(null)
      removeCurrentUser()
      setAuthError(null)
      setLoading(false)
    }
  }, [])

  // ── Update Profile ───────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    setLoading(true)
    setAuthError(null)
    try {
      const updated = await updateUser(currentUser.id, updates)
      setCurrentUserState(updated)
      setCurrentUser(updated)
      return updated
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // ── Change Password ──────────────────────────────
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true)
    setAuthError(null)
    try {
      const updated = await changePassword(
        currentUser.id,
        currentPassword,
        newPassword
      )
      setCurrentUserState(updated)
      setCurrentUser(updated)
      return updated
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // ── Delete Account ───────────────────────────────
  const deleteAccount = useCallback(async () => {
    setLoading(true)
    setAuthError(null)
    try {
      await deleteUser(currentUser.id)
      setCurrentUserState(null)
      removeCurrentUser()
      return { success: true }
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // ── Update Donor ID On User ──────────────────────
  // called after registering as donor to link donorId
  const linkDonorId = useCallback(async (donorId) => {
    try {
      const updated = await updateUser(currentUser.id, {
        role:    'user',
        donorId: donorId,
        donorStatus: 'pending',
      })
      setCurrentUserState(updated)
      setCurrentUser(updated)
      return updated
    } catch (error) {
      console.warn('[Auth] Failed to link donor ID:', error)
      throw error
    }
  }, [currentUser])

  // ── Sync Profile ──────────────────────────────────
  // fetches latest user role and status from the DB
  const syncProfile = useCallback(async () => {
    if (!currentUser) return
    try {
      const latest = await getUserById(currentUser.id)
      setCurrentUserState(latest)
      setCurrentUser(latest)
      return latest
    } catch (error) {
      console.warn('[Auth] Failed to sync profile:', error)
    }
  }, [currentUser])

  // ── Computed Values ──────────────────────────────
  const isLoggedIn  = Boolean(currentUser)
  const isDonor     = currentUser?.role === 'donor'
  const isAdmin     = currentUser?.role === 'admin'
  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() ?? '?'

  // ── Context Value ────────────────────────────────
  const value = {
    // state
    currentUser,
    loading,
    authError,
    // computed
    isLoggedIn,
    isDonor,
    isAdmin,
    userInitial,
    // actions
    login,
    googleLogin,
    signup,
    logout,
    updateProfile,
    updatePassword,
    deleteAccount,
    linkDonorId,
    syncProfile,
    clearError,
  }

  // ── Render ───────────────────────────────────────
  // show nothing while restoring session on first load
  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading BloodConnect...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ════════════════════════════════════════════════════
//  CUSTOM HOOK
// ════════════════════════════════════════════════════
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}