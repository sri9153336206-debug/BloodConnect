import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import {
  getAllDonors,
  registerDonor,
  updateDonor,
  toggleDonorAvailability,
  deleteDonor,
} from '../services/mockApi.js'
import { filterDonors } from '../utils/filterDonors.js'
import {
  getAvailableCount,
  getCountByBloodGroup,
  getUniqueLocations,
  hasActiveFilters,
  getFilterSummary,
} from '../utils/filterDonors.js'

// ── Create Context ───────────────────────────────────
const DonorContext = createContext(null)

// ── Initial Filter State ─────────────────────────────
const initialFilters = {
  query:         '',
  bloodGroup:    '',
  location:      '',
  availableOnly: false,
  sortBy:        'nearest',
}

// ════════════════════════════════════════════════════
//  DONOR PROVIDER
// ════════════════════════════════════════════════════
export const DonorProvider = ({ children }) => {

  // ── State ────────────────────────────────────────
  const [donors, setDonors]         = useState([])
  const [filters, setFilters]       = useState(initialFilters)
  const [loading, setLoading]       = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError]           = useState(null)
  const [selectedDonor, setSelectedDonor] = useState(null)

  // ── Fetch All Donors On Mount ────────────────────
  useEffect(() => {
    fetchDonors()
  }, [])

  // ── Fetch Donors ─────────────────────────────────
  const fetchDonors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllDonors()
      setDonors(data)
    } catch (err) {
      setError(err.message || 'Failed to load donors.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Filtered Donors (memoized) ───────────────────
  // recomputes only when donors or filters change
  const filteredDonors = useMemo(
    () => filterDonors(donors, filters),
    [donors, filters]
  )

  // ── Stats (memoized) ─────────────────────────────
  const stats = useMemo(() => ({
    total:          donors.length,
    available:      getAvailableCount(donors),
    filtered:       filteredDonors.length,
    byBloodGroup:   getCountByBloodGroup(donors),
    locations:      getUniqueLocations(donors),
  }), [donors, filteredDonors])

  // ── Filter Summary Text ──────────────────────────
  const filterSummary = useMemo(
    () => getFilterSummary(filteredDonors.length, filters),
    [filteredDonors.length, filters]
  )

  // ── Is Any Filter Active ─────────────────────────
  const isFiltered = useMemo(
    () => hasActiveFilters(filters),
    [filters]
  )

  // ── Update Single Filter ─────────────────────────
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Update Multiple Filters At Once ─────────────
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // ── Reset All Filters ────────────────────────────
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  // ── Add New Donor To List ────────────────────────
  const addDonor = useCallback(async (donorData) => {
    setActionLoading(true)
    setError(null)
    try {
      const newDonor = await registerDonor(donorData)
      setDonors(prev => [...prev, newDonor])
      return newDonor
    } catch (err) {
      setError(err.message || 'Failed to register donor.')
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [])

  // ── Update Donor In List ─────────────────────────
  const updateDonorInList = useCallback(async (id, updates) => {
    setActionLoading(true)
    setError(null)
    try {
      const updated = await updateDonor(id, updates)
      setDonors(prev =>
        prev.map(d => d.id === id ? updated : d)
      )
      // update selectedDonor if it is the same donor
      if (selectedDonor?.id === id) {
        setSelectedDonor(updated)
      }
      return updated
    } catch (err) {
      setError(err.message || 'Failed to update donor.')
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [selectedDonor])

  // ── Toggle Donor Availability ────────────────────
  const toggleAvailability = useCallback(async (id) => {
    setActionLoading(true)
    setError(null)
    try {
      const updated = await toggleDonorAvailability(id)
      setDonors(prev =>
        prev.map(d => d.id === id ? updated : d)
      )
      if (selectedDonor?.id === id) {
        setSelectedDonor(updated)
      }
      return updated
    } catch (err) {
      setError(err.message || 'Failed to toggle availability.')
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [selectedDonor])

  // ── Remove Donor From List ───────────────────────
  const removeDonor = useCallback(async (id) => {
    setActionLoading(true)
    setError(null)
    try {
      await deleteDonor(id)
      setDonors(prev => prev.filter(d => d.id !== id))
      if (selectedDonor?.id === id) {
        setSelectedDonor(null)
      }
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to remove donor.')
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [selectedDonor])

  // ── Get Donor By ID From Local State ────────────
  // fast lookup without API call
  const getDonorFromState = useCallback((id) => {
    return donors.find(d => d.id === id) ?? null
  }, [donors])

  // ── Select A Donor ───────────────────────────────
  const selectDonor = useCallback((donor) => {
    setSelectedDonor(donor)
  }, [])

  // ── Clear Selected Donor ─────────────────────────
  const clearSelectedDonor = useCallback(() => {
    setSelectedDonor(null)
  }, [])

  // ── Clear Error ──────────────────────────────────
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ── Context Value ────────────────────────────────
  const value = {
    // state
    donors,
    filteredDonors,
    filters,
    loading,
    actionLoading,
    error,
    selectedDonor,
    // computed
    stats,
    filterSummary,
    isFiltered,
    // filter actions
    updateFilter,
    updateFilters,
    resetFilters,
    // donor actions
    fetchDonors,
    addDonor,
    updateDonorInList,
    toggleAvailability,
    removeDonor,
    getDonorFromState,
    // selection
    selectDonor,
    clearSelectedDonor,
    // error
    clearError,
  }

  return (
    <DonorContext.Provider value={value}>
      {children}
    </DonorContext.Provider>
  )
}

// ════════════════════════════════════════════════════
//  CUSTOM HOOK
// ════════════════════════════════════════════════════
export const useDonors = () => {
  const context = useContext(DonorContext)
  if (!context) {
    throw new Error('useDonors must be used inside DonorProvider')
  }
  return context
}