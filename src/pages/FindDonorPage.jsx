import { useEffect, useRef } from 'react'
import { useSearchParams }   from 'react-router-dom'
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw,
  Users,
} from 'lucide-react'
import { useDonors } from '../context/DonorContext.jsx'
import { useUI }     from '../context/UIContext.jsx'
import SearchBar     from '../components/features/SearchBar.jsx'
import FilterPanel   from '../components/features/FilterPanel.jsx'
import { InlineFilterBar } from '../components/features/FilterPanel.jsx'
import {
  DonorGrid,
  DonorListItem,
} from '../components/features/DonorCard.jsx'
import {
  DonorGridSkeleton,
  InlineLoader,
} from '../components/ui/Loader.jsx'
import {
  NoDonorsFound,
  FilterEmptyState,
  ErrorState,
} from '../components/ui/EmptyState.jsx'
import { AvailabilityBadge } from '../components/ui/Badge.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ════════════════════════════════════════════════════
//  FIND DONOR PAGE
// ════════════════════════════════════════════════════
const FindDonorPage = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    filteredDonors,
    filters,
    loading,
    error,
    stats,
    isFiltered,
    filterSummary,
    updateFilter,
    updateFilters,
    resetFilters,
    fetchDonors,
  } = useDonors()

  const {
    toggleFilterDrawer,
  } = useUI()

  // ── Local State ───────────────────────────────────
  const [viewMode, setViewMode] = useState('grid')

  // ── Ref For Result Count Announcement ────────────
  const resultRef = useRef(null)

  // ── Read URL Query Params On Mount ────────────────
  // supports deep links like:
  // /find-donors?bloodGroup=A+
  // /find-donors?q=Rahul
  useEffect(() => {
    const bloodGroup    = searchParams.get('bloodGroup') ?? ''
    const query         = searchParams.get('q')          ?? ''
    const availableOnly = searchParams.get('available')  === 'true'

    if (bloodGroup || query || availableOnly) {
      updateFilters({ bloodGroup, query, availableOnly })
    }
  }, [])

  // ── Scroll Results Into View When Filters Change ──
  useEffect(() => {
    if (isFiltered && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block:    'start',
      })
    }
  }, [filters.bloodGroup, filters.availableOnly])

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════
           PAGE HEADER
      ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Find Blood Donors
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filterSummary}
              </p>
            </div>

            {/* Stats Pills */}
            <div className="hidden sm:flex items-center gap-2">
              <div className={[
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-gray-100 rounded-full',
                'text-xs font-semibold text-gray-600',
              ].join(' ')}>
                <Users size={13} />
                {stats.total} Total
              </div>
              <div className={[
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-green-50 rounded-full',
                'text-xs font-semibold text-green-600',
              ].join(' ')}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {stats.available} Available
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar size="md" showSuggestions />

          {/* Inline Filter Bar */}
          <div className="mt-4">
            <InlineFilterBar />
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
           MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar Filter (Desktop) ─────────── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel />
            </div>
          </aside>

          {/* ── Results Area ──────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Results Toolbar */}
            <div
              ref={resultRef}
              className={[
                'flex items-center justify-between mb-4',
                'bg-white rounded-2xl',
                'border border-gray-100',
                'px-4 py-3',
              ].join(' ')}
            >
              {/* Left: Count */}
              <p className="text-sm font-medium text-gray-600">
                {loading ? (
                  'Loading donors...'
                ) : (
                  <>
                    <span className="font-bold text-gray-900">
                      {filteredDonors.length}
                    </span>
                    {' '}donor{filteredDonors.length !== 1 ? 's' : ''} found
                  </>
                )}
              </p>

              {/* Right: Controls */}
              <div className="flex items-center gap-2">

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={toggleFilterDrawer}
                  className={[
                    'lg:hidden flex items-center gap-1.5',
                    'px-3 py-1.5 rounded-xl',
                    'border border-gray-200',
                    'text-sm font-medium text-gray-600',
                    'hover:bg-gray-50 hover:border-gray-300',
                    'transition-colors duration-150',
                    isFiltered
                      ? 'border-red-300 text-red-600 bg-red-50'
                      : '',
                  ].join(' ')}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {isFiltered && (
                    <span className={[
                      'w-4 h-4 rounded-full',
                      'bg-red-600 text-white',
                      'text-xs font-bold',
                      'flex items-center justify-center',
                    ].join(' ')}>
                      !
                    </span>
                  )}
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={fetchDonors}
                  disabled={loading}
                  className={[
                    'w-8 h-8 rounded-xl',
                    'flex items-center justify-center',
                    'border border-gray-200',
                    'text-gray-500 hover:text-red-600',
                    'hover:bg-red-50 hover:border-red-200',
                    'transition-all duration-150',
                    'focus:outline-none',
                    loading ? 'animate-spin' : '',
                  ].join(' ')}
                  aria-label="Refresh donors"
                >
                  <RefreshCw size={14} />
                </button>

                {/* View Mode Toggle */}
                <div className={[
                  'flex items-center',
                  'border border-gray-200 rounded-xl overflow-hidden',
                ].join(' ')}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={[
                      'w-8 h-8 flex items-center justify-center',
                      'transition-colors duration-150',
                      viewMode === 'grid'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={[
                      'w-8 h-8 flex items-center justify-center',
                      'border-l border-gray-200',
                      'transition-colors duration-150',
                      viewMode === 'list'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List size={14} />
                  </button>
                </div>

              </div>
            </div>

            {/* ── Loading State ──────────────────── */}
            {loading && (
              <DonorGridSkeleton count={6} />
            )}

            {/* ── Error State ────────────────────── */}
            {!loading && error && (
              <ErrorState
                message={error}
                onRetry={fetchDonors}
              />
            )}

            {/* ── Empty State ────────────────────── */}
            {!loading && !error && filteredDonors.length === 0 && (
              isFiltered ? (
                <FilterEmptyState
                  filters={filters}
                  onReset={resetFilters}
                  onRegister={() => navigate('/register-donor')}
                />
              ) : (
                <NoDonorsFound
                  onReset={resetFilters}
                  onRegister={() => navigate('/register-donor')}
                />
              )
            )}

            {/* ── Grid View ──────────────────────── */}
            {!loading && !error && filteredDonors.length > 0 && viewMode === 'grid' && (
              <DonorGrid
                donors={filteredDonors}
                columns={2}
                showActions
                showContact
              />
            )}

            {/* ── List View ──────────────────────── */}
            {!loading && !error && filteredDonors.length > 0 && viewMode === 'list' && (
              <div className="space-y-2">
                {filteredDonors.map(donor => (
                  <DonorListItem
                    key={donor.id}
                    donor={donor}
                    showFavorite
                  />
                ))}
              </div>
            )}

            {/* ── Load More ──────────────────────── */}
            {!loading && filteredDonors.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400 font-medium">
                  Showing all {filteredDonors.length} donors
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}

export default FindDonorPage