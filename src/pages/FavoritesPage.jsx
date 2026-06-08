import { useState, useMemo } from 'react'
import { useNavigate }       from 'react-router-dom'
import {
  Heart,
  Search,
  Trash2,
  SlidersHorizontal,
  X,
  Droplets,
} from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useDonors }    from '../context/DonorContext.jsx'
import { useUI }        from '../context/UIContext.jsx'
import {
  DonorGrid,
  DonorListItem,
} from '../components/features/DonorCard.jsx'
import { SimpleSearchInput } from '../components/features/SearchBar.jsx'
import { BloodGroupFilterRow } from '../components/features/BloodGroupSelector.jsx'
import Button  from '../components/ui/Button.jsx'
import {
  NoFavorites,
  NoDonorsFound,
} from '../components/ui/EmptyState.jsx'
import { InlineLoader } from '../components/ui/Loader.jsx'
import { ConfirmModal } from '../components/ui/Modal.jsx'
import { CountBadge }   from '../components/ui/Badge.jsx'

// ════════════════════════════════════════════════════
//  FAVORITES PAGE
// ════════════════════════════════════════════════════
const FavoritesPage = () => {

  const navigate  = useNavigate()
  const {
    favorites,
    favoritesCount,
    clearFavorites,
    loading,
  } = useFavorites()

  const { donors } = useDonors()
  const { showSuccess } = useUI()

  // ── Local State ───────────────────────────────────
  const [searchQuery,  setSearchQuery]  = useState('')
  const [bloodFilter,  setBloodFilter]  = useState('')
  const [viewMode,     setViewMode]     = useState('grid')
  const [showClearModal, setShowClearModal] = useState(false)
  const [availableOnly,  setAvailableOnly]  = useState(false)

  // ── Get Full Donor Objects For Favorites ──────────
  const favoriteDonors = useMemo(() => {
    return donors.filter(d => favorites.includes(d.id))
  }, [donors, favorites])

  // ── Apply Local Filters ───────────────────────────
  const filteredFavorites = useMemo(() => {
    let result = [...favoriteDonors]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(q)     ||
        d.location.toLowerCase().includes(q) ||
        d.bloodGroup.toLowerCase().includes(q)
      )
    }

    if (bloodFilter) {
      result = result.filter(d => d.bloodGroup === bloodFilter)
    }

    if (availableOnly) {
      result = result.filter(d => d.availability === true)
    }

    return result
  }, [favoriteDonors, searchQuery, bloodFilter, availableOnly])

  // ── Is Any Filter Active ──────────────────────────
  const isFiltered = Boolean(
    searchQuery.trim() || bloodFilter || availableOnly
  )

  // ── Handle Clear All Favorites ────────────────────
  const handleClearAll = () => {
    clearFavorites()
    setShowClearModal(false)
    showSuccess('All favorites cleared.')
  }

  // ── Handle Reset Filters ──────────────────────────
  const handleResetFilters = () => {
    setSearchQuery('')
    setBloodFilter('')
    setAvailableOnly(false)
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ══════════════════════════════════════════
           PAGE HEADER
      ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Title Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={[
                'w-10 h-10 rounded-xl',
                'bg-red-50 text-red-500',
                'flex items-center justify-center',
              ].join(' ')}>
                <Heart size={20} className="fill-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  My Favorites
                  <CountBadge count={favoritesCount} />
                </h1>
                <p className="text-sm text-gray-500">
                  {favoritesCount > 0
                    ? `${favoritesCount} saved donor${favoritesCount !== 1 ? 's' : ''}`
                    : 'No saved donors yet'
                  }
                </p>
              </div>
            </div>

            {/* Clear All Button */}
            {favoritesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearModal(true)}
                leftIcon={<Trash2 size={14} />}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Search + Filters (shown only when have favorites) */}
          {favoritesCount > 0 && (
            <div className="space-y-3">

              {/* Search */}
              <SimpleSearchInput
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search saved donors..."
              />

              {/* Filter Row */}
              <div className="flex items-center gap-3 flex-wrap">

                {/* Blood Group Filter */}
                <BloodGroupFilterRow
                  value={bloodFilter}
                  onChange={setBloodFilter}
                />

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200" aria-hidden="true" />

                {/* Available Toggle */}
                <button
                  type="button"
                  onClick={() => setAvailableOnly(prev => !prev)}
                  className={[
                    'flex items-center gap-1.5',
                    'px-3 py-1.5 rounded-full',
                    'text-xs font-semibold border',
                    'transition-all duration-150',
                    availableOnly
                      ? 'bg-green-50 text-green-700 border-green-400'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300',
                  ].join(' ')}
                  aria-pressed={availableOnly}
                >
                  <span className={[
                    'w-1.5 h-1.5 rounded-full',
                    availableOnly ? 'bg-green-500' : 'bg-gray-300',
                  ].join(' ')} />
                  Available Now
                </button>

                {/* View Mode Toggle */}
                <div className="ml-auto flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                  {['grid', 'list'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={[
                        'px-3 py-1.5 text-xs font-semibold',
                        'transition-colors duration-150',
                        viewMode === mode
                          ? 'bg-red-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                        mode === 'list' ? 'border-l border-gray-200' : '',
                      ].join(' ')}
                      aria-pressed={viewMode === mode}
                    >
                      {mode === 'grid' ? '⊞ Grid' : '≡ List'}
                    </button>
                  ))}
                </div>

              </div>

              {/* Active Filters Summary */}
              {isFiltered && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Showing{' '}
                    <strong className="text-gray-700">
                      {filteredFavorites.length}
                    </strong>
                    {' '}of{' '}
                    <strong className="text-gray-700">
                      {favoritesCount}
                    </strong>
                    {' '}saved donors
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className={[
                      'flex items-center gap-1',
                      'text-xs text-red-500 font-medium',
                      'hover:text-red-700',
                      'transition-colors duration-150',
                    ].join(' ')}
                  >
                    <X size={11} />
                    Clear filters
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════
           CONTENT
      ══════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Loading ──────────────────────────── */}
        {loading && (
          <InlineLoader message="Loading your favorites..." />
        )}

        {/* ── Empty — No Favorites At All ──────── */}
        {!loading && favoritesCount === 0 && (
          <NoFavorites
            onFindDonors={() => navigate('/find-donors')}
          />
        )}

        {/* ── Empty — Filters Returned Nothing ─── */}
        {!loading && favoritesCount > 0 && filteredFavorites.length === 0 && (
          <div className="text-center py-16 animate-fade-in">

            <div className={[
              'w-16 h-16 rounded-full',
              'bg-gray-100 text-gray-300',
              'flex items-center justify-center',
              'mx-auto mb-4',
            ].join(' ')}>
              <Search size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No matching donors
            </h3>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
              {searchQuery
                ? `No saved donors match "${searchQuery}"`
                : 'No saved donors match the selected filters'
              }
            </p>

            <Button
              variant="outline"
              size="md"
              onClick={handleResetFilters}
              leftIcon={<X size={14} />}
            >
              Clear Filters
            </Button>

          </div>
        )}

        {/* ── Grid View ──────────────────────────── */}
        {!loading && filteredFavorites.length > 0 && viewMode === 'grid' && (
          <div className="space-y-4">

            {/* Results count */}
            <p className="text-sm text-gray-500 font-medium">
              {isFiltered
                ? `${filteredFavorites.length} matching donors`
                : `All ${favoritesCount} saved donors`
              }
            </p>

            <DonorGrid
              donors={filteredFavorites}
              columns={3}
              showActions
              showContact
            />

          </div>
        )}

        {/* ── List View ──────────────────────────── */}
        {!loading && filteredFavorites.length > 0 && viewMode === 'list' && (
          <div className="space-y-4">

            {/* Results count */}
            <p className="text-sm text-gray-500 font-medium">
              {isFiltered
                ? `${filteredFavorites.length} matching donors`
                : `All ${favoritesCount} saved donors`
              }
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filteredFavorites.map(donor => (
                  <div key={donor.id} className="px-2 py-1">
                    <DonorListItem
                      donor={donor}
                      showFavorite
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Quick Actions ──────────────────────── */}
        {!loading && favoritesCount > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Find more donors to save for quick access
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/find-donors')}
                leftIcon={<Search size={16} />}
              >
                Find More Donors
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* ── Blood Group Stats Bar ─────────────── */}
      {!loading && favoritesCount > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                Blood Groups
              </span>
              {Object.entries(
                favoriteDonors.reduce((acc, d) => {
                  acc[d.bloodGroup] = (acc[d.bloodGroup] ?? 0) + 1
                  return acc
                }, {})
              )
              .sort(([, a], [, b]) => b - a)
              .map(([group, count]) => (
                <button
                  key={group}
                  type="button"
                  onClick={() =>
                    setBloodFilter(bloodFilter === group ? '' : group)
                  }
                  className={[
                    'flex items-center gap-1.5',
                    'px-3 py-1.5 rounded-full flex-shrink-0',
                    'text-xs font-bold border',
                    'transition-all duration-150',
                    bloodFilter === group
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-red-50 text-red-600 border-red-100 hover:border-red-300',
                  ].join(' ')}
                  aria-pressed={bloodFilter === group}
                  aria-label={`Filter by ${group}`}
                >
                  <Droplets size={10} aria-hidden="true" />
                  {group}
                  <span className={[
                    'ml-0.5 px-1.5 py-0.5 rounded-full text-xs',
                    bloodFilter === group
                      ? 'bg-white/20 text-white'
                      : 'bg-red-100 text-red-500',
                  ].join(' ')}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Clear All Confirm Modal ────────────── */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear all favorites?"
        message={`This will remove all ${favoritesCount} saved donors from your favorites. This cannot be undone.`}
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
        confirmLabel="Yes, Clear All"
        cancelLabel="Keep Favorites"
        type="danger"
      />

    </div>
  )
}

export default FavoritesPage