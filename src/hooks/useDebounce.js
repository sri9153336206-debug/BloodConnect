import { useState, useEffect, useRef, useCallback } from 'react'

// ════════════════════════════════════════════════════
//  MAIN DEBOUNCE HOOK
// ════════════════════════════════════════════════════

// returns a debounced version of the value
// only updates after the user stops typing for `delay` ms
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // set a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // clear timer if value changes before delay completes
    // this is the key debounce behaviour
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

// ════════════════════════════════════════════════════
//  DEBOUNCED CALLBACK HOOK
// ════════════════════════════════════════════════════

// debounces a function call instead of a value
// useful for search API calls, form auto-save etc
export const useDebouncedCallback = (callback, delay = 400) => {
  const timerRef    = useRef(null)
  const callbackRef = useRef(callback)

  // keep callback ref up to date without resetting timer
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedFn = useCallback((...args) => {
    // clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    // set new timer
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay])

  // cancel pending call on unmount
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  // flush — call immediately without waiting
  const flush = useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    callbackRef.current(...args)
  }, [])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { debouncedFn, cancel, flush }
}

// ════════════════════════════════════════════════════
//  DEBOUNCED SEARCH HOOK
// ════════════════════════════════════════════════════

// combines input state + debounce in one hook
// perfect for search bars
export const useDebouncedSearch = (initialValue = '', delay = 400) => {
  const [searchQuery, setSearchQuery]         = useState(initialValue)
  const [isSearching, setIsSearching]         = useState(false)
  const debouncedQuery = useDebounce(searchQuery, delay)

  // whenever raw query changes → mark as searching
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true)
    }
  }, [searchQuery, debouncedQuery])

  // whenever debounced query settles → stop searching
  useEffect(() => {
    setIsSearching(false)
  }, [debouncedQuery])

  // handle input change
  const handleSearch = useCallback((e) => {
    const value = typeof e === 'string' ? e : e?.target?.value ?? ''
    setSearchQuery(value)
  }, [])

  // clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return {
    searchQuery,      // raw value — bind to input
    debouncedQuery,   // debounced value — use for filtering
    isSearching,      // true while user is still typing
    handleSearch,     // onChange handler
    clearSearch,      // clear button handler
    setSearchQuery,   // direct setter if needed
  }
}

// ════════════════════════════════════════════════════
//  THROTTLE HOOK
// ════════════════════════════════════════════════════

// throttle — fires at most once every `limit` ms
// useful for scroll events, resize handlers
export const useThrottle = (value, limit = 200) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated                         = useRef(Date.now())

  useEffect(() => {
    const now     = Date.now()
    const elapsed = now - lastUpdated.current

    if (elapsed >= limit) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, limit - elapsed)

      return () => clearTimeout(timer)
    }
  }, [value, limit])

  return throttledValue
}