import { useState } from 'react'
import { Droplets, Info, ChevronDown } from 'lucide-react'
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '../../constants/index.js'

// ════════════════════════════════════════════════════
//  BLOOD GROUP BUTTON — single selectable pill
// ════════════════════════════════════════════════════
const BloodGroupButton = ({
  group,
  isSelected,
  isCompatible,
  isIncompatible,
  onClick,
  size        = 'md',
  showTooltip = false,
}) => {

  const [tooltipVisible, setTooltipVisible] = useState(false)

  // ── Size Classes ──────────────────────────────────
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  // ── State Classes ─────────────────────────────────
  const getStateClasses = () => {
    if (isSelected) {
      return [
        'bg-red-600 text-white',
        'border-2 border-red-600',
        'shadow-lg shadow-red-200',
        'scale-110',
      ].join(' ')
    }
    if (isCompatible) {
      return [
        'bg-green-50 text-green-700',
        'border-2 border-green-400',
        'hover:bg-green-100',
      ].join(' ')
    }
    if (isIncompatible) {
      return [
        'bg-gray-50 text-gray-300',
        'border-2 border-gray-100',
        'opacity-50 cursor-not-allowed',
      ].join(' ')
    }
    return [
      'bg-white text-gray-700',
      'border-2 border-gray-200',
      'hover:border-red-300',
      'hover:bg-red-50 hover:text-red-600',
    ].join(' ')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !isIncompatible && onClick(group)}
        onMouseEnter={() => showTooltip && setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        disabled={isIncompatible}
        className={[
          'flex items-center justify-center',
          'rounded-2xl font-bold',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1',
          sizeClasses[size] ?? sizeClasses.md,
          getStateClasses(),
        ].join(' ')}
        aria-pressed={isSelected}
        aria-label={`${group} blood group`}
      >
        {group}
      </button>

      {/* Tooltip */}
      {showTooltip && tooltipVisible && (
        <div className={[
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
          'bg-gray-900 text-white text-xs',
          'px-2 py-1 rounded-lg',
          'whitespace-nowrap z-20',
          'pointer-events-none',
        ].join(' ')}>
          {isCompatible   && 'Compatible donor'}
          {isIncompatible && 'Incompatible'}
          {isSelected     && 'Selected'}
          {!isCompatible && !isIncompatible && !isSelected && group}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  MAIN BLOOD GROUP SELECTOR
// ════════════════════════════════════════════════════
const BloodGroupSelector = ({
  // value
  value     = '',
  onChange,

  // style
  size      = 'md',
  label     = 'Blood Group',
  required  = false,
  error     = '',

  // features
  showCompatibility = false,
  recipientGroup    = '',
  showLabel         = true,
  showLegend        = false,
  allowDeselect     = true,
  className         = '',
}) => {

  // ── Get Compatible Groups ─────────────────────────
  const compatibleGroups = recipientGroup
    ? (BLOOD_COMPATIBILITY[recipientGroup]?.canReceiveFrom ?? [])
    : []

  // ── Handle Select ─────────────────────────────────
  const handleSelect = (group) => {
    if (!onChange) return
    if (allowDeselect && value === group) {
      onChange('')
    } else {
      onChange(group)
    }
  }

  // ── Is Compatible / Incompatible ──────────────────
  const isCompatible   = (g) => showCompatibility && compatibleGroups.includes(g)
  const isIncompatible = (g) => showCompatibility && !compatibleGroups.includes(g) && value !== g

  // ── Render ───────────────────────────────────────
  return (
    <div className={['space-y-3', className].join(' ')}>

      {/* Label */}
      {showLabel && label && (
        <div className="flex items-center gap-1.5">
          <Droplets size={15} className="text-red-500" aria-hidden="true" />
          <label className="text-sm font-semibold text-gray-700">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        </div>
      )}

      {/* Blood Group Grid */}
      <div
        className="grid grid-cols-4 gap-2.5"
        role="group"
        aria-label="Select blood group"
      >
        {BLOOD_GROUPS.map(group => (
          <BloodGroupButton
            key={group}
            group={group}
            isSelected={value === group}
            isCompatible={isCompatible(group)}
            isIncompatible={isIncompatible(group)}
            onClick={handleSelect}
            size={size}
            showTooltip={showCompatibility}
          />
        ))}
      </div>

      {/* Selected Display */}
      {value && (
        <div className={[
          'flex items-center gap-2',
          'px-3 py-2 rounded-xl',
          'bg-red-50 border border-red-100',
        ].join(' ')}>
          <div className={[
            'w-7 h-7 rounded-full',
            'bg-red-600 text-white',
            'flex items-center justify-center',
            'text-xs font-bold flex-shrink-0',
          ].join(' ')}>
            {value}
          </div>
          <div>
            <p className="text-xs font-semibold text-red-700">
              {value} Selected
            </p>
            {showCompatibility && recipientGroup && (
              <p className="text-xs text-gray-500">
                {isCompatible(value)
                  ? '✓ Compatible with ' + recipientGroup
                  : '✗ Not compatible with ' + recipientGroup
                }
              </p>
            )}
          </div>
          {allowDeselect && (
            <button
              type="button"
              onClick={() => onChange?.('')}
              className="ml-auto text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
              aria-label="Clear blood group selection"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1" role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      {/* Compatibility Legend */}
      {showLegend && showCompatibility && (
        <div className="flex flex-wrap gap-3 pt-1">
          <LegendItem color="bg-red-600"   label="Selected"     />
          <LegendItem color="bg-green-400" label="Compatible"   />
          <LegendItem color="bg-gray-200"  label="Incompatible" />
        </div>
      )}

    </div>
  )
}

export default BloodGroupSelector

// ════════════════════════════════════════════════════
//  LEGEND ITEM HELPER
// ════════════════════════════════════════════════════
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={['w-3 h-3 rounded-full', color].join(' ')} aria-hidden="true" />
    <span className="text-xs text-gray-500">{label}</span>
  </div>
)

// ════════════════════════════════════════════════════
//  BLOOD GROUP DROPDOWN — select version
// ════════════════════════════════════════════════════
export const BloodGroupDropdown = ({
  value     = '',
  onChange,
  label     = 'Blood Group',
  required  = false,
  error     = '',
  placeholder = 'Select blood group',
  size      = 'md',
  className = '',
  disabled  = false,
}) => {

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const getStateClasses = () => {
    if (disabled) return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
    if (error)    return 'border-red-400 bg-red-50 focus:ring-red-400'
    return 'border-gray-200 bg-white hover:border-gray-300 focus:border-red-500 focus:ring-red-500'
  }

  return (
    <div className={['flex flex-col gap-1.5 w-full', className].join(' ')}>

      {/* Label */}
      {label && (
        <div className="flex items-center gap-1.5">
          <Droplets size={14} className="text-red-500" aria-hidden="true" />
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        </div>
      )}

      {/* Select */}
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={[
            'w-full rounded-xl border',
            'appearance-none cursor-pointer',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'pr-9',
            sizeClasses[size] ?? sizeClasses.md,
            getStateClasses(),
          ].join(' ')}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {BLOOD_GROUPS.map(group => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 font-medium" role="alert">
          {error}
        </p>
      )}

    </div>
  )
}

// ════════════════════════════════════════════════════
//  BLOOD GROUP INFO CARD
// ════════════════════════════════════════════════════
// shows compatibility info for a given blood group
export const BloodGroupInfoCard = ({
  bloodGroup,
  className = '',
}) => {

  const [isExpanded, setIsExpanded] = useState(false)

  if (!bloodGroup || !BLOOD_COMPATIBILITY[bloodGroup]) return null

  const { canDonateTo, canReceiveFrom } = BLOOD_COMPATIBILITY[bloodGroup]

  return (
    <div className={[
      'rounded-2xl border border-red-100',
      'bg-red-50 overflow-hidden',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        className={[
          'w-full flex items-center justify-between',
          'px-4 py-3',
          'hover:bg-red-100 transition-colors duration-150',
          'focus:outline-none',
        ].join(' ')}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className={[
            'w-9 h-9 rounded-full',
            'bg-red-600 text-white',
            'flex items-center justify-center',
            'text-sm font-bold flex-shrink-0',
          ].join(' ')}>
            {bloodGroup}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-red-800">
              Blood Group {bloodGroup}
            </p>
            <p className="text-xs text-red-500">
              Tap to see compatibility
            </p>
          </div>
        </div>
        <Info
          size={16}
          className="text-red-400 flex-shrink-0"
          aria-hidden="true"
        />
      </button>

      {/* Compatibility Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in border-t border-red-100">

          {/* Can Donate To */}
          <div className="pt-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Can Donate To
            </p>
            <div className="flex flex-wrap gap-1.5">
              {canDonateTo.map(g => (
                <span
                  key={g}
                  className={[
                    'px-2.5 py-1 rounded-lg',
                    'text-xs font-bold',
                    'bg-green-100 text-green-700',
                    'border border-green-200',
                  ].join(' ')}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Can Receive From */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Can Receive From
            </p>
            <div className="flex flex-wrap gap-1.5">
              {canReceiveFrom.map(g => (
                <span
                  key={g}
                  className={[
                    'px-2.5 py-1 rounded-lg',
                    'text-xs font-bold',
                    'bg-blue-100 text-blue-700',
                    'border border-blue-200',
                  ].join(' ')}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Universal Donor/Recipient Note */}
          {bloodGroup === 'O-' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              <p className="text-xs text-green-700 font-medium">
                🌟 O- is the universal donor — compatible with all blood groups!
              </p>
            </div>
          )}
          {bloodGroup === 'AB+' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <p className="text-xs text-blue-700 font-medium">
                🌟 AB+ is the universal recipient — can receive from all blood groups!
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

// ════════════════════════════════════════════════════
//  BLOOD GROUP STATS — shows count per group
// ════════════════════════════════════════════════════
export const BloodGroupStats = ({
  stats     = {},
  className = '',
}) => {

  const total = Object.values(stats).reduce((sum, n) => sum + n, 0)

  if (total === 0) return null

  return (
    <div className={[
      'grid grid-cols-4 gap-2',
      className,
    ].filter(Boolean).join(' ')}>
      {BLOOD_GROUPS.map(group => {
        const count      = stats[group] ?? 0
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0

        return (
          <div
            key={group}
            className={[
              'flex flex-col items-center',
              'p-3 rounded-xl',
              'bg-white border border-gray-100',
              'hover:border-red-200 hover:shadow-sm',
              'transition-all duration-150',
            ].join(' ')}
          >
            {/* Group Label */}
            <div className={[
              'w-9 h-9 rounded-full mb-1.5',
              'bg-red-100 text-red-700',
              'flex items-center justify-center',
              'text-xs font-bold',
            ].join(' ')}>
              {group}
            </div>

            {/* Count */}
            <p className="text-sm font-bold text-gray-900">
              {count}
            </p>

            {/* Percentage */}
            <p className="text-xs text-gray-400">
              {percentage}%
            </p>

            {/* Mini Bar */}
            <div className="w-full mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${group}: ${count} donors (${percentage}%)`}
              />
            </div>

          </div>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  BLOOD GROUP FILTER ROW — compact horizontal bar
// ════════════════════════════════════════════════════
export const BloodGroupFilterRow = ({
  value     = '',
  onChange,
  className = '',
}) => {

  return (
    <div className={[
      'flex items-center gap-2 flex-wrap',
      className,
    ].filter(Boolean).join(' ')}>

      {/* All Option */}
      <button
        type="button"
        onClick={() => onChange?.('')}
        className={[
          'px-3 py-1.5 rounded-full',
          'text-xs font-semibold',
          'border transition-all duration-150',
          value === ''
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
        ].join(' ')}
        aria-pressed={value === ''}
      >
        All
      </button>

      {/* Blood Group Options */}
      {BLOOD_GROUPS.map(group => (
        <button
          key={group}
          type="button"
          onClick={() => onChange?.(value === group ? '' : group)}
          className={[
            'px-3 py-1.5 rounded-full',
            'text-xs font-bold',
            'border transition-all duration-150',
            value === group
              ? 'bg-red-600 text-white border-red-600 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50',
          ].join(' ')}
          aria-pressed={value === group}
          aria-label={`Filter by ${group}`}
        >
          {group}
        </button>
      ))}

    </div>
  )
}