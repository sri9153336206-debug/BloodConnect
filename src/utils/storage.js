import { STORAGE_KEYS } from '../constants/index.js'

// ── Core Get ─────────────────────────────────────────
export const getItem = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key)
    if (value === null || value === undefined) return fallback
    return JSON.parse(value)
  } catch (error) {
    console.warn(`[Storage] Failed to get "${key}":`, error)
    return fallback
  }
}

// ── Core Set ─────────────────────────────────────────
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to set "${key}":`, error)
    return false
  }
}

// ── Core Remove ──────────────────────────────────────
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to remove "${key}":`, error)
    return false
  }
}

// ── Clear All App Data ───────────────────────────────
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.warn('[Storage] Failed to clear all:', error)
    return false
  }
}

// ── Check If Key Exists ──────────────────────────────
export const hasItem = (key) => {
  try {
    return localStorage.getItem(key) !== null
  } catch (error) {
    console.warn(`[Storage] Failed to check "${key}":`, error)
    return false
  }
}

// ── Get Storage Size (in KB) ─────────────────────────
export const getStorageSize = () => {
  try {
    let total = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const value = localStorage.getItem(key)
      if (value) total += value.length * 2
    })
    return (total / 1024).toFixed(2)
  } catch (error) {
    console.warn('[Storage] Failed to calculate size:', error)
    return 0
  }
}

// ── Current User Helpers ─────────────────────────────
export const getCurrentUser = () => {
  return getItem(STORAGE_KEYS.CURRENT_USER, null)
}

export const setCurrentUser = (user) => {
  return setItem(STORAGE_KEYS.CURRENT_USER, user)
}

export const removeCurrentUser = () => {
  return removeItem(STORAGE_KEYS.CURRENT_USER)
}

// ── Donors Helpers ───────────────────────────────────
export const getStoredDonors = () => {
  return getItem(STORAGE_KEYS.DONORS, null)
}

export const setStoredDonors = (donors) => {
  return setItem(STORAGE_KEYS.DONORS, donors)
}

// ── Users Helpers ────────────────────────────────────
export const getStoredUsers = () => {
  return getItem(STORAGE_KEYS.USERS, null)
}

export const setStoredUsers = (users) => {
  return setItem(STORAGE_KEYS.USERS, users)
}

// ── Favorites Helpers ────────────────────────────────
export const getStoredFavorites = () => {
  return getItem(STORAGE_KEYS.FAVORITES, [])
}

export const setStoredFavorites = (favorites) => {
  return setItem(STORAGE_KEYS.FAVORITES, favorites)
}

// ── Update Single Item In Array ──────────────────────
export const updateItemInStorage = (key, id, updates) => {
  try {
    const items = getItem(key, [])
    if (!Array.isArray(items)) return false
    const updated = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
    return setItem(key, updated)
  } catch (error) {
    console.warn(`[Storage] Failed to update item in "${key}":`, error)
    return false
  }
}

// ── Add Single Item To Array ─────────────────────────
export const addItemToStorage = (key, newItem) => {
  try {
    const items = getItem(key, [])
    if (!Array.isArray(items)) return false
    return setItem(key, [...items, newItem])
  } catch (error) {
    console.warn(`[Storage] Failed to add item to "${key}":`, error)
    return false
  }
}

// ── Remove Single Item From Array ────────────────────
export const removeItemFromStorage = (key, id) => {
  try {
    const items = getItem(key, [])
    if (!Array.isArray(items)) return false
    const filtered = items.filter(item => item.id !== id)
    return setItem(key, filtered)
  } catch (error) {
    console.warn(`[Storage] Failed to remove item from "${key}":`, error)
    return false
  }
}