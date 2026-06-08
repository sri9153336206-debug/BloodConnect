import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { getItem, setItem, removeItem } from '../utils/storage.js'

// ════════════════════════════════════════════════════
//  MAIN LOCAL STORAGE HOOK
// ════════════════════════════════════════════════════

// syncs a state value with localStorage
// works exactly like useState but persists on refresh
const useLocalStorage = (key, initialValue) => {

  // ── Initialize State From Storage ────────────────
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getItem(key)
      // return stored value if exists, else initialValue
      return item !== null ? item : initialValue
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read "${key}":`, error)
      return initialValue
    }
  })

  // ── Set Value ────────────────────────────────────
  // updates both state and localStorage
  const setValue = useCallback((value) => {
    try {
      // support functional updates like useState
      const valueToStore = typeof value === 'function'
        ? value(storedValue)
        : value

      setStoredValue(valueToStore)
      setItem(key, valueToStore)
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to set "${key}":`, error)
    }
  }, [key, storedValue])

  // ── Remove Value ─────────────────────────────────
  // removes from localStorage and resets to initialValue
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      removeItem(key)
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove "${key}":`, error)
    }
  }, [key, initialValue])

  // ── Refresh From Storage ─────────────────────────
  // manually re-reads from localStorage
  // useful after external updates
  const refreshValue = useCallback(() => {
    try {
      const item = getItem(key)
      setStoredValue(item !== null ? item : initialValue)
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to refresh "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, refreshValue]
}

export default useLocalStorage

// ════════════════════════════════════════════════════
//  STORAGE EVENT SYNC HOOK
// ════════════════════════════════════════════════════

// syncs state across multiple browser tabs
// listens to the storage event fired by other tabs
export const useStorageSync = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const stored = getItem(key)
    return stored !== null ? stored : initialValue
  })

  const setValueRef = useRef(setValue)

  useEffect(() => {
    setValueRef.current = setValue
  }, [setValue])

  // listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue
            ? JSON.parse(e.newValue)
            : initialValue
          setValueRef.current(newValue)
        } catch {
          setValueRef.current(initialValue)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  const updateValue = useCallback((newValue) => {
    const toStore = typeof newValue === 'function'
      ? newValue(value)
      : newValue
    setValue(toStore)
    setItem(key, toStore)
  }, [key, value])

  return [value, updateValue]
}

// ════════════════════════════════════════════════════
//  BOOLEAN STORAGE HOOK
// ════════════════════════════════════════════════════

// specialized hook for boolean values in localStorage
// e.g. dark mode, notification preferences
export const useBooleanStorage = (key, initialValue = false) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)

  const toggle    = useCallback(() => setValue(prev => !prev), [setValue])
  const setTrue   = useCallback(() => setValue(true),          [setValue])
  const setFalse  = useCallback(() => setValue(false),         [setValue])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    reset: removeValue,
  }
}

// ════════════════════════════════════════════════════
//  ARRAY STORAGE HOOK
// ════════════════════════════════════════════════════

// specialized hook for arrays in localStorage
// e.g. favorites, recent searches, history
export const useArrayStorage = (key, initialValue = []) => {
  const [array, setArray, removeArray] = useLocalStorage(key, initialValue)

  // add item to array
  const addItem = useCallback((item) => {
    setArray(prev => {
      if (Array.isArray(prev) && prev.includes(item)) return prev
      return [...(Array.isArray(prev) ? prev : []), item]
    })
  }, [setArray])

  // remove item from array
  const removeItem = useCallback((item) => {
    setArray(prev =>
      Array.isArray(prev) ? prev.filter(i => i !== item) : []
    )
  }, [setArray])

  // toggle item in array (add if absent, remove if present)
  const toggleItem = useCallback((item) => {
    setArray(prev => {
      if (!Array.isArray(prev)) return [item]
      return prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    })
  }, [setArray])

  // check if item exists in array
  const hasItem = useCallback((item) => {
    return Array.isArray(array) && array.includes(item)
  }, [array])

  // clear entire array
  const clearArray = useCallback(() => {
    setArray([])
  }, [setArray])

  return {
    array,
    setArray,
    addItem,
    removeItem,
    toggleItem,
    hasItem,
    clearArray,
    reset: removeArray,
    count: Array.isArray(array) ? array.length : 0,
  }
}

// ════════════════════════════════════════════════════
//  RECENT SEARCHES HOOK
// ════════════════════════════════════════════════════

// stores last N search queries in localStorage
// used in SearchBar to show recent searches dropdown
export const useRecentSearches = (key = 'bc_recent_searches', maxItems = 5) => {
  const [searches, setSearches] = useLocalStorage(key, [])

  // add new search to top of list
  const addSearch = useCallback((query) => {
    if (!query || !query.trim()) return

    setSearches(prev => {
      const cleaned = query.trim()
      const existing = Array.isArray(prev) ? prev : []
      // remove duplicate if already exists
      const filtered = existing.filter(
        s => s.toLowerCase() !== cleaned.toLowerCase()
      )
      // add to top and keep max items
      return [cleaned, ...filtered].slice(0, maxItems)
    })
  }, [setSearches, maxItems])

  // remove a single search from history
  const removeSearch = useCallback((query) => {
    setSearches(prev =>
      Array.isArray(prev)
        ? prev.filter(s => s !== query)
        : []
    )
  }, [setSearches])

  // clear all search history
  const clearSearches = useCallback(() => {
    setSearches([])
  }, [setSearches])

  return {
    searches:      Array.isArray(searches) ? searches : [],
    addSearch,
    removeSearch,
    clearSearches,
    hasSearches:   Array.isArray(searches) && searches.length > 0,
  }
}