import { useState } from 'react'
import {
  SlidersHorizontal,
  MapPin,
  Droplets,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useDonors }    from '../../context/DonorContext.jsx'
import { useUI }        from '../../context/UIContext.jsx'
import Button           from '../ui/Button.jsx'
import { TagBadge }     from '../ui/Badge.jsx'
import {
  BLOOD_GROUPS,
  CITIES,
  SORT_OPTIONS,
} from '../../constants/index.js'

// ════════════════════════════════════════════════════
//  FILTER SECTION WRAPPER
// ════════════════════════════════════════════════════
const FilterSection = ({
  title,
  icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-0">

      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={[
          'w-full flex items-center justify-between',
          'py-3 px-1',
          'text-left',
          'hover:text-red-600',
          'transition-colors duration-150',
          'focus:outline-none',
        ].join(' ')}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">
            {title}
          </span>
        </div>
        {isOpen
          ? <ChevronUp   size={15} className="text-gray-400" />
          : <ChevronDown size={15} className="text-gray-400" />
        }
      </button>

      {/* Section Content */}
      {isOpen && (
        <div className="pb-4 px-1 animate-fade-in">
          {children}
        </div>
      )}

    </div>
  )
}

// ════════════════════════════════════════════════════
//  BLOOD GROUP SELECTOR GRID
// ════════════════════════════════════════════════════
const BloodGroupGrid = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {BLOOD_GROUPS.map(group => {
        const isSelected = value === group
        return (
          <button
            key={group}
            type="button"
            onClick={() => onChange(isSelected ? '' : group)}
            className={[
              'flex items-center justify-center',
              'h-10 rounded-xl',
              'text-sm font-bold',
              'border-2',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-red-400',
              isSelected
                ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50',
            ].join(' ')}
            aria-pressed={isSelected}
            aria-label={`${group} blood group`}
          >
            {group}
          </button>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  LOCATION INPUT WITH SUGGESTIONS
// ════════════════════════════════════════════════════
const LocationInput = ({ value, onChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  )

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <MapPin
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Enter city or area..."
          className={[
            'w-full pl-9 pr-3 py-2.5 rounded-xl',
            'border border-gray-200 bg-white',
            'text-sm text-gray-900 placeholder-gray-400',
            'hover:border-gray-300',
            'focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400',
            'transition-all duration-200',
          ].join(' ')}
        />
        {/* Clear Location */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Clear location"
          >
            ×
          </button>
        )}
      </div>

      {/* City Suggestions */}
      {showSuggestions && filteredCities.length > 0 && (
        <div className={[
          'absolute top-full left-0 right-0 mt-1',
          'bg-white rounded-xl shadow-lg',
          'border border-gray-100',
          'z-20 overflow-hidden',
          'max-h-40 overflow-y-auto',
        ].join(' ')}>
          {filteredCities.slice(0, 6).map(city => (
            <button
              key={city}
              type="button"
              onMouseDown={() => {
                onChange(city)
                setShowSuggestions(false)
              }}
              className={[
                'w-full flex items-center gap-2',
                'px-3 py-2.5',
                'text-sm text-gray-700',
                'hover:bg-red-50 hover:text-red-600',
                'transition-colors duration-100',
                'text-left',
              ].join(' ')}
            >
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  SORT SELECT
// ════════════════════════════════════════════════════
const SortSelect = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={[
        'w-full px-3 py-2.5 rounded-xl',
        'border border-gray-200 bg-white',
        'text-sm text-gray-700',
        'hover:border-gray-300',
        'focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400',
        'transition-all duration-200',
        'appearance-none cursor-pointer',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")]',
        'bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat pr-8',
      ].join(' ')}
      aria-label="Sort donors by"
    >
      {SORT_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// ════════════════════════════════════════════════════
//  AVAILABILITY TOGGLE
// ════════════════════════════════════════════════════
const AvailabilityToggle = ({ value, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={[
        'w-full flex items-center justify-between',
        'px-4 py-3 rounded-xl',
        'border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-400',
        value
          ? 'bg-green-50 border-green-400 text-green-700'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300',
      ].join(' ')}
      aria-pressed={value}
      aria-label="Show available donors only"
    >
      <div className="flex items-center gap-2.5">
        {/* Toggle Dot */}
        <div className={[
          'relative w-10 h-5 rounded-full transition-colors duration-200',
          value ? 'bg-green-500' : 'bg-gray-200',
        ].join(' ')}>
          <div className={[
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            value ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')} />
        </div>
        <span className="text-sm font-medium">
          Available Donors Only
        </span>
      </div>

      {value && (
        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
      )}
    </button>
  )
}

// ════════════════════════════════════════════════════
//  ACTIVE FILTER TAGS
// ════════════════════════════════════════════════════
const ActiveFilterTags = ({ filters, onRemove }) => {
  const activeTags = []

  if (filters.bloodGroup) {
    activeTags.push({
      key:   'bloodGroup',
      label: filters.bloodGroup,
    })
  }
  if (filters.location) {
    activeTags.push({
      key:   'location',
      label: filters.location,
    })
  }
  if (filters.availableOnly) {
    activeTags.push({
      key:   'availableOnly',
      label: 'Available only',
    })
  }

  if (activeTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-3">
      {activeTags.map(tag => (
        <TagBadge
          key={tag.key}
          label={tag.label}
          onRemove={() => onRemove(tag.key)}
        />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  MAIN FILTER PANEL COMPONENT
// ════════════════════════════════════════════════════
const FilterPanel = ({
  className    = '',
  onApply,
  showHeader   = true,
  compact      = false,
}) => {

  const {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    stats,
    isFiltered,
    filterSummary,
  } = useDonors()

  const { closeFilterDrawer } = useUI()

  // ── Local State (uncommitted filters) ─────────────
  // We keep local state so "Apply" button works
  // instead of live-updating on every change
  const [localFilters, setLocalFilters] = useState({
    bloodGroup:    filters.bloodGroup,
    location:      filters.location,
    availableOnly: filters.availableOnly,
    sortBy:        filters.sortBy,
  })

  // ── Update Local Filter ───────────────────────────
  const setLocal = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  // ── Check If Local Differs From Applied ───────────
  const hasChanges = (
    localFilters.bloodGroup    !== filters.bloodGroup    ||
    localFilters.location      !== filters.location      ||
    localFilters.availableOnly !== filters.availableOnly ||
    localFilters.sortBy        !== filters.sortBy
  )

  // ── Apply Filters ─────────────────────────────────
  const handleApply = () => {
    updateFilters(localFilters)
    closeFilterDrawer()
    if (onApply) onApply(localFilters)
  }

  // ── Reset All ─────────────────────────────────────
  const handleReset = () => {
    const empty = {
      bloodGroup:    '',
      location:      '',
      availableOnly: false,
      sortBy:        'nearest',
    }
    setLocalFilters(empty)
    resetFilters()
    closeFilterDrawer()
  }

  // ── Remove Single Tag ─────────────────────────────
  const handleRemoveTag = (key) => {
    const resetValue = key === 'availableOnly' ? false : ''
    setLocal(key, resetValue)
    updateFilter(key, resetValue)
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className={[
      'bg-white rounded-2xl',
      compact ? '' : 'border border-gray-100 shadow-sm',
      className,
    ].filter(Boolean).join(' ')}>

      {/* ── Header ──────────────────────────── */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-red-600" />
            <h3 className="font-bold text-gray-900 text-base">
              Filters
            </h3>
            {isFiltered && (
              <span className={[
                'px-2 py-0.5 rounded-full',
                'bg-red-100 text-red-600',
                'text-xs font-bold',
              ].join(' ')}>
                Active
              </span>
            )}
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className={[
                'flex items-center gap-1.5',
                'text-xs font-medium text-gray-500',
                'hover:text-red-600',
                'transition-colors duration-150',
              ].join(' ')}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      )}

      {/* ── Filter Summary ───────────────────── */}
      {isFiltered && (
        <div className="px-4 pt-3">
          <p className="text-xs text-gray-500 font-medium mb-2">
            {filterSummary}
          </p>
          <ActiveFilterTags
            filters={filters}
            onRemove={handleRemoveTag}
          />
        </div>
      )}

      {/* ── Filter Sections ──────────────────── */}
      <div className="p-4 space-y-1">

        {/* Blood Group */}
        <FilterSection
          title="Blood Group"
          icon={<Droplets size={15} />}
          defaultOpen={true}
        >
          <BloodGroupGrid
            value={localFilters.bloodGroup}
            onChange={val => setLocal('bloodGroup', val)}
          />
        </FilterSection>

        {/* Location */}
        <FilterSection
          title="Location"
          icon={<MapPin size={15} />}
          defaultOpen={true}
        >
          <LocationInput
            value={localFilters.location}
            onChange={val => setLocal('location', val)}
          />
        </FilterSection>

        {/* Availability */}
        <FilterSection
          title="Availability"
          icon={<CheckCircle2 size={15} />}
          defaultOpen={true}
        >
          <AvailabilityToggle
            value={localFilters.availableOnly}
            onChange={val => setLocal('availableOnly', val)}
          />
        </FilterSection>

        {/* Sort By */}
        <FilterSection
          title="Sort By"
          icon={<ArrowUpDown size={15} />}
          defaultOpen={false}
        >
          <SortSelect
            value={localFilters.sortBy}
            onChange={val => setLocal('sortBy', val)}
          />
        </FilterSection>

      </div>

      {/* ── Stats Bar ───────────────────────── */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {stats.total}
            </p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              {stats.available}
            </p>
            <p className="text-xs text-gray-500">Available</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">
              {stats.filtered}
            </p>
            <p className="text-xs text-gray-500">Filtered</p>
          </div>
        </div>
      </div>

      {/* ── Apply Button ─────────────────────── */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleApply}
          disabled={!hasChanges && !isFiltered}
        >
          Apply Filters
        </Button>
        {isFiltered && (
          <Button
            variant="outline"
            size="md"
            onClick={handleReset}
          >
            <RotateCcw size={15} />
          </Button>
        )}
      </div>

    </div>
  )
}

export default FilterPanel

// ════════════════════════════════════════════════════
//  INLINE FILTER BAR — horizontal for top of page
// ════════════════════════════════════════════════════
export const InlineFilterBar = ({ className = '' }) => {

  const { filters, updateFilter, resetFilters, isFiltered } = useDonors()

  return (
    <div className={[
      'flex flex-wrap items-center gap-3',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Blood Group Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {BLOOD_GROUPS.map(group => (
          <button
            key={group}
            type="button"
            onClick={() =>
              updateFilter('bloodGroup', filters.bloodGroup === group ? '' : group)
            }
            className={[
              'px-3 py-1.5 rounded-full',
              'text-xs font-bold',
              'border transition-all duration-150',
              filters.bloodGroup === group
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600',
            ].join(' ')}
            aria-pressed={filters.bloodGroup === group}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200" aria-hidden="true" />

      {/* Available Toggle */}
      <button
        type="button"
        onClick={() => updateFilter('availableOnly', !filters.availableOnly)}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
          'text-xs font-semibold border',
          'transition-all duration-150',
          filters.availableOnly
            ? 'bg-green-50 text-green-700 border-green-400'
            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300',
        ].join(' ')}
        aria-pressed={filters.availableOnly}
      >
        <span className={[
          'w-1.5 h-1.5 rounded-full',
          filters.availableOnly ? 'bg-green-500' : 'bg-gray-300',
        ].join(' ')} />
        Available Now
      </button>

      {/* Reset */}
      {isFiltered && (
        <button
          type="button"
          onClick={resetFilters}
          className={[
            'flex items-center gap-1',
            'px-3 py-1.5 rounded-full',
            'text-xs font-medium',
            'text-red-500 hover:text-red-700',
            'border border-red-200 hover:border-red-300',
            'bg-red-50 hover:bg-red-100',
            'transition-all duration-150',
          ].join(' ')}
        >
          <RotateCcw size={11} />
          Reset
        </button>
      )}

    </div>
  )
}