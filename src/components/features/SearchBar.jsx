import { useEffect, useRef, useState } from 'react'
import { useNavigate }                 from 'react-router-dom'
import { Search, X, Clock, TrendingUp, MapPin, Droplets } from 'lucide-react'
import { useDonors }                   from '../../context/DonorContext.jsx'
import { useUI }                       from '../../context/UIContext.jsx'
import useDebounce                     from '../../hooks/useDebounce.js'
import { useRecentSearches }           from '../../hooks/useLocalStorage.js'
import { BLOOD_GROUPS }                from '../../constants/index.js'

// ════════════════════════════════════════════════════
//  SEARCH BAR COMPONENT
// ════════════════════════════════════════════════════
const SearchBar = ({
  // style
  size        = 'md',
  fullWidth   = true,
  placeholder = 'Search by name, location or blood group...',
  className   = '',

  // behaviour
  autoFocus   = false,
  showSuggestions = true,
  navigateOnSearch = false,

  // callbacks
  onSearch,
}) => {

  const navigate                            = useNavigate()
  const { filters, updateFilter, filteredDonors } = useDonors()
  const { closeFilterDrawer }               = useUI()
  const { searches, addSearch, clearSearches } = useRecentSearches()

  // ── State ────────────────────────────────────────
  const [inputValue,    setInputValue]    = useState(filters.query ?? '')
  const [isFocused,     setIsFocused]     = useState(false)
  const [showDropdown,  setShowDropdown]  = useState(false)

  // ── Refs ─────────────────────────────────────────
  const inputRef    = useRef(null)
  const wrapperRef  = useRef(null)

  // ── Debounce Input → Update Context Filter ────────
  const debouncedValue = useDebounce(inputValue, 400)

  useEffect(() => {
    updateFilter('query', debouncedValue)
    if (onSearch) onSearch(debouncedValue)
  }, [debouncedValue])

  // ── Sync Input If External Filter Resets ─────────
  useEffect(() => {
    if (filters.query === '' && inputValue !== '') {
      setInputValue('')
    }
  }, [filters.query])

  // ── Close Dropdown On Outside Click ──────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Auto Focus ────────────────────────────────────
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [autoFocus])

  // ── Handle Input Change ───────────────────────────
  const handleChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    setShowDropdown(true)
  }

  // ── Handle Clear ──────────────────────────────────
  const handleClear = () => {
    setInputValue('')
    updateFilter('query', '')
    inputRef.current?.focus()
    setShowDropdown(false)
  }

  // ── Handle Focus ──────────────────────────────────
  const handleFocus = () => {
    setIsFocused(true)
    if (showSuggestions) setShowDropdown(true)
  }

  // ── Handle Keyboard ───────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
      setShowDropdown(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  // ── Handle Submit ─────────────────────────────────
  const handleSubmit = () => {
    if (!inputValue.trim()) return
    addSearch(inputValue.trim())
    setShowDropdown(false)
    inputRef.current?.blur()
    if (navigateOnSearch) {
      navigate(`/find-donors?q=${encodeURIComponent(inputValue.trim())}`)
    }
    closeFilterDrawer()
  }

  // ── Handle Suggestion Click ───────────────────────
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    updateFilter('query', suggestion)
    addSearch(suggestion)
    setShowDropdown(false)
    inputRef.current?.focus()
    if (navigateOnSearch) {
      navigate(`/find-donors?q=${encodeURIComponent(suggestion)}`)
    }
  }

  // ── Handle Blood Group Quick Filter ──────────────
  const handleBloodGroupClick = (group) => {
    updateFilter('bloodGroup', group)
    setShowDropdown(false)
    if (navigateOnSearch) {
      navigate(`/find-donors?bloodGroup=${encodeURIComponent(group)}`)
    }
  }

  // ── Size Classes ──────────────────────────────────
  const sizeClasses = {
    sm: 'h-10 text-sm pl-9 pr-9',
    md: 'h-12 text-sm pl-10 pr-10',
    lg: 'h-14 text-base pl-12 pr-12',
  }

  const iconSizes = { sm: 15, md: 17, lg: 20 }
  const iconSize  = iconSizes[size] ?? 17

  // ── Is Dropdown Visible ───────────────────────────
  const hasRecentSearches  = searches.length > 0
  const isDropdownVisible  = showDropdown && isFocused && showSuggestions
  const showEmpty          = !inputValue.trim()

  // ── Live Results Count ────────────────────────────
  const resultCount = filteredDonors.length

  // ── Render ───────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={[
        'relative',
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
    >

      {/* ── Input Wrapper ──────────────────── */}
      <div className="relative flex items-center">

        {/* Search Icon */}
        <div className={[
          'absolute left-3 z-10',
          'flex items-center justify-center',
          'pointer-events-none',
          isFocused ? 'text-red-500' : 'text-gray-400',
          'transition-colors duration-200',
        ].join(' ')}>
          <Search size={iconSize} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search donors"
          aria-expanded={isDropdownVisible}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          className={[
            'w-full rounded-2xl border-2',
            'bg-white text-gray-900 placeholder-gray-400',
            'transition-all duration-200',
            'focus:outline-none',
            isFocused
              ? 'border-red-500 shadow-lg shadow-red-50'
              : 'border-gray-200 hover:border-gray-300',
            sizeClasses[size] ?? sizeClasses.md,
          ].join(' ')}
        />

        {/* Right Side */}
        <div className="absolute right-3 flex items-center gap-1.5">

          {/* Live Result Count */}
          {inputValue && !showDropdown && (
            <span className="text-xs text-gray-400 font-medium">
              {resultCount} found
            </span>
          )}

          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className={[
                'w-5 h-5 rounded-full',
                'flex items-center justify-center',
                'bg-gray-200 hover:bg-red-100',
                'text-gray-500 hover:text-red-600',
                'transition-colors duration-150',
                'focus:outline-none',
              ].join(' ')}
              aria-label="Clear search"
            >
              <X size={11} />
            </button>
          )}

        </div>
      </div>

      {/* ── Dropdown ───────────────────────── */}
      {isDropdownVisible && (
        <div
          className={[
            'absolute top-full left-0 right-0 mt-2',
            'bg-white rounded-2xl shadow-xl',
            'border border-gray-100',
            'z-50 overflow-hidden',
            'animate-scale-in',
          ].join(' ')}
          role="listbox"
          aria-label="Search suggestions"
        >

          {/* ── When Input Is Empty ─────────── */}
          {showEmpty && (
            <>
              {/* Recent Searches */}
              {hasRecentSearches && (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <Clock size={12} />
                      Recent Searches
                    </div>
                    <button
                      type="button"
                      onClick={clearSearches}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {searches.slice(0, 4).map((s, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(s)}
                          className={[
                            'w-full flex items-center gap-3',
                            'px-3 py-2.5 rounded-xl',
                            'text-sm text-gray-700',
                            'hover:bg-red-50 hover:text-red-600',
                            'transition-colors duration-100',
                            'text-left',
                          ].join(' ')}
                        >
                          <Clock size={14} className="text-gray-300 flex-shrink-0" />
                          <span className="truncate">{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Blood Group Filter */}
              <div className={[
                'p-3',
                hasRecentSearches ? 'border-t border-gray-50' : '',
              ].join(' ')}>
                <div className="flex items-center gap-1.5 mb-2 px-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <TrendingUp size={12} />
                  Quick Filter by Blood Group
                </div>
                <div className="flex flex-wrap gap-2 px-1">
                  {BLOOD_GROUPS.map(group => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => handleBloodGroupClick(group)}
                      className={[
                        'px-3 py-1.5 rounded-xl',
                        'text-xs font-bold',
                        'transition-all duration-150',
                        filters.bloodGroup === group
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-red-50 text-red-600 hover:bg-red-100',
                        'border border-red-100',
                      ].join(' ')}
                      aria-label={`Filter by ${group}`}
                      aria-pressed={filters.bloodGroup === group}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="px-4 py-3 border-t border-gray-50 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  💡 Type a name, location, or blood group to search
                </p>
              </div>
            </>
          )}

          {/* ── When Typing ─────────────────── */}
          {!showEmpty && (
            <>
              {/* Live Results Count */}
              <div className="px-4 py-2.5 border-b border-gray-50">
                <p className="text-xs font-medium text-gray-500">
                  {resultCount > 0
                    ? `${resultCount} donor${resultCount !== 1 ? 's' : ''} found`
                    : 'No donors found'}
                </p>
              </div>

              {/* Top Matching Donors */}
              {filteredDonors.length > 0 && (
                <ul className="p-2">
                  {filteredDonors.slice(0, 5).map(donor => (
                    <li key={donor.id}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(donor.name)}
                        className={[
                          'w-full flex items-center gap-3',
                          'px-3 py-2.5 rounded-xl',
                          'hover:bg-red-50',
                          'transition-colors duration-100',
                          'text-left group',
                        ].join(' ')}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          {donor.photoUrl ? (
                            <img
                              src={donor.photoUrl}
                              alt={donor.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-red-600">
                              {donor.name?.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                            {donor.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              <MapPin size={10} className="text-gray-400" />
                              <span className="text-xs text-gray-400 truncate">
                                {donor.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Blood Group */}
                        <div className={[
                          'flex items-center justify-center',
                          'w-8 h-8 rounded-full flex-shrink-0',
                          'bg-red-100 text-red-700',
                          'text-xs font-bold',
                        ].join(' ')}>
                          {donor.bloodGroup}
                        </div>

                        {/* Availability dot */}
                        <div className={[
                          'w-2 h-2 rounded-full flex-shrink-0',
                          donor.availability ? 'bg-green-500' : 'bg-gray-300',
                        ].join(' ')} />

                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* No Results */}
              {filteredDonors.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Search size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">
                    No donors match "{inputValue}"
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different name or location
                  </p>
                </div>
              )}

              {/* View All Results */}
              {filteredDonors.length > 5 && (
                <div className="border-t border-gray-50 p-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={[
                      'w-full py-2.5 rounded-xl',
                      'text-sm font-semibold text-red-600',
                      'hover:bg-red-50',
                      'transition-colors duration-150',
                    ].join(' ')}
                  >
                    View all {resultCount} results →
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      )}

    </div>
  )
}

export default SearchBar

// ════════════════════════════════════════════════════
//  HERO SEARCH BAR — large version for home page
// ════════════════════════════════════════════════════
export const HeroSearchBar = ({ className = '' }) => {

  const navigate              = useNavigate()
  const { updateFilter }      = useDonors()
  const [query, setQuery]     = useState('')
  const [bloodGroup, setBloodGroup] = useState('')

  const handleSearch = () => {
    if (query.trim()) updateFilter('query', query.trim())
    if (bloodGroup)   updateFilter('bloodGroup', bloodGroup)
    navigate('/find-donors')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={[
      'bg-white rounded-2xl shadow-xl p-4',
      'border border-gray-100',
      className,
    ].filter(Boolean).join(' ')}>

      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name or location..."
            className={[
              'w-full pl-10 pr-4 h-12 rounded-xl',
              'border-2 border-gray-100 hover:border-gray-200',
              'focus:border-red-400 focus:outline-none',
              'text-sm text-gray-900 placeholder-gray-400',
              'transition-all duration-200',
            ].join(' ')}
          />
        </div>

        {/* Blood Group Select */}
        <div className="relative">
          <Droplets
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={bloodGroup}
            onChange={e => setBloodGroup(e.target.value)}
            className={[
              'pl-9 pr-8 h-12 rounded-xl',
              'border-2 border-gray-100 hover:border-gray-200',
              'focus:border-red-400 focus:outline-none',
              'text-sm text-gray-700 bg-white',
              'appearance-none cursor-pointer',
              'transition-all duration-200',
              'min-w-[120px]',
            ].join(' ')}
            aria-label="Select blood group"
          >
            <option value="">Blood Group</option>
            {BLOOD_GROUPS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className={[
            'h-12 px-6 rounded-xl',
            'bg-red-600 hover:bg-red-700',
            'text-white font-semibold text-sm',
            'transition-colors duration-200',
            'shadow-sm hover:shadow-md',
            'whitespace-nowrap',
            'flex items-center gap-2',
          ].join(' ')}
        >
          <Search size={16} />
          Find Donors
        </button>

      </div>

    </div>
  )
}

// ════════════════════════════════════════════════════
//  SIMPLE SEARCH INPUT — minimal version
// ════════════════════════════════════════════════════
export const SimpleSearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className   = '',
  size        = 'md',
}) => {

  const sizeClasses = {
    sm: 'h-9 text-sm pl-8 pr-8',
    md: 'h-10 text-sm pl-9 pr-9',
    lg: 'h-12 text-sm pl-10 pr-10',
  }

  return (
    <div className={['relative', className].join(' ')}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={[
          'w-full rounded-xl border border-gray-200',
          'bg-white text-gray-900 placeholder-gray-400',
          'hover:border-gray-300',
          'focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400',
          'transition-all duration-200',
          sizeClasses[size] ?? sizeClasses.md,
        ].join(' ')}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Clear"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}