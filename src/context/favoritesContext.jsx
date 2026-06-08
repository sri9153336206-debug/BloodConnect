import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import {
  getStoredFavorites,
  setStoredFavorites,
} from '../utils/storage.js'
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from '../services/mockApi.js'
import { useAuth } from './AuthContext.jsx'

// ── Create Context ───────────────────────────────────
const FavoritesContext = createContext(null)

// ════════════════════════════════════════════════════
//  FAVORITES PROVIDER
// ════════════════════════════════════════════════════
export const FavoritesProvider = ({ children }) => {

  const { currentUser, isLoggedIn } = useAuth()

  // ── State ────────────────────────────────────────
  const [favorites, setFavorites]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  // ── Load Favorites On Mount / User Change ────────
  // if logged in → load from user record in storage
  // if not logged in → load from general localStorage key
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true)
      try {
        if (isLoggedIn && currentUser?.id) {
          const userFavs = await getUserFavorites(currentUser.id)
          setFavorites(userFavs ?? [])
          setStoredFavorites(userFavs ?? [])
        } else {
          const stored = getStoredFavorites()
          setFavorites(stored ?? [])
        }
      } catch (err) {
        console.warn('[Favorites] Failed to load:', err)
        const stored = getStoredFavorites()
        setFavorites(stored ?? [])
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [currentUser?.id, isLoggedIn])

  // ── Is Favorite ──────────────────────────────────
  const isFavorite = useCallback(
    (donorId) => favorites.includes(donorId),
    [favorites]
  )

  // ── Toggle Favorite ──────────────────────────────
  const toggleFavorite = useCallback(async (donorId) => {
    setError(null)
    const isCurrentlyFav = favorites.includes(donorId)

    // optimistic update — update UI immediately
    const optimisticFavs = isCurrentlyFav
      ? favorites.filter(id => id !== donorId)
      : [...favorites, donorId]

    setFavorites(optimisticFavs)
    setStoredFavorites(optimisticFavs)

    // sync with user record if logged in
    if (isLoggedIn && currentUser?.id) {
      try {
        if (isCurrentlyFav) {
          await removeFromFavorites(currentUser.id, donorId)
        } else {
          await addToFavorites(currentUser.id, donorId)
        }
      } catch (err) {
        // revert optimistic update on failure
        setError(err.message || 'Failed to update favorites.')
        setFavorites(favorites)
        setStoredFavorites(favorites)
      }
    }
  }, [favorites, isLoggedIn, currentUser])

  // ── Add To Favorites ─────────────────────────────
  const addFavorite = useCallback(async (donorId) => {
    if (favorites.includes(donorId)) return
    setError(null)

    const updated = [...favorites, donorId]
    setFavorites(updated)
    setStoredFavorites(updated)

    if (isLoggedIn && currentUser?.id) {
      try {
        await addToFavorites(currentUser.id, donorId)
      } catch (err) {
        setError(err.message || 'Failed to add favorite.')
        setFavorites(favorites)
        setStoredFavorites(favorites)
      }
    }
  }, [favorites, isLoggedIn, currentUser])

  // ── Remove From Favorites ────────────────────────
  const removeFavorite = useCallback(async (donorId) => {
    if (!favorites.includes(donorId)) return
    setError(null)

    const updated = favorites.filter(id => id !== donorId)
    setFavorites(updated)
    setStoredFavorites(updated)

    if (isLoggedIn && currentUser?.id) {
      try {
        await removeFromFavorites(currentUser.id, donorId)
      } catch (err) {
        setError(err.message || 'Failed to remove favorite.')
        setFavorites(favorites)
        setStoredFavorites(favorites)
      }
    }
  }, [favorites, isLoggedIn, currentUser])

  // ── Clear All Favorites ──────────────────────────
  const clearFavorites = useCallback(() => {
    setFavorites([])
    setStoredFavorites([])
  }, [])

  // ── Get Favorite Donor IDs ───────────────────────
  const favoriteDonorIds = useMemo(
    () => [...favorites],
    [favorites]
  )

  // ── Favorites Count ──────────────────────────────
  const favoritesCount = useMemo(
    () => favorites.length,
    [favorites]
  )

  // ── Clear Error ──────────────────────────────────
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ── Context Value ────────────────────────────────
  const value = {
    // state
    favorites,
    favoriteDonorIds,
    favoritesCount,
    loading,
    error,
    // actions
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    clearError,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// ════════════════════════════════════════════════════
//  CUSTOM HOOK
// ════════════════════════════════════════════════════
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider')
  }
  return context
}