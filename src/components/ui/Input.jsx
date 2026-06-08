import { useState, forwardRef } from 'react'
import { Eye, EyeOff, X, Search, AlertCircle, CheckCircle2 } from 'lucide-react'

// ════════════════════════════════════════════════════
//  MAIN INPUT COMPONENT
// ════════════════════════════════════════════════════
const Input = forwardRef(({
  // content
  label,
  placeholder   = '',
  helperText,
  error         = '',
  success       = '',

  // type
  type          = 'text',

  // value
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,

  // icons
  leftIcon,
  rightIcon,

  // state
  disabled      = false,
  readOnly      = false,
  required      = false,
  loading       = false,

  // style
  fullWidth     = true,
  size          = 'md',
  className     = '',
  inputClassName = '',
  labelClassName = '',

  // clear button
  clearable     = false,
  onClear,

  // html attrs
  id,
  name,
  autoComplete,
  autoFocus,
  maxLength,
  minLength,
  min,
  max,
  pattern,
  tabIndex,

  ...rest
}, ref) => {

  // ── Internal Password Visibility State ────────────
  const [showPassword, setShowPassword] = useState(false)

  // ── Resolve Input Type ─────────────────────────────
  const resolvedType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type

  // ── Size Classes ──────────────────────────────────
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
  }

  // ── Input State Classes ───────────────────────────
  const getInputStateClasses = () => {
    if (disabled) {
      return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
    }
    if (error) {
      return 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
    }
    if (success) {
      return 'border-green-400 bg-green-50 focus:ring-green-400 focus:border-green-400'
    }
    return [
      'border-gray-200 bg-white',
      'hover:border-gray-300',
      'focus:border-red-500 focus:ring-red-500',
    ].join(' ')
  }

  // ── Left Padding (when left icon present) ─────────
  const leftPaddingClass = leftIcon
    ? size === 'lg' ? 'pl-11' : 'pl-10'
    : ''

  // ── Right Padding (when right icon/clear/password) ─
  const hasRightElement = rightIcon || clearable || type === 'password'
  const rightPaddingClass = hasRightElement
    ? size === 'lg' ? 'pr-11' : 'pr-10'
    : ''

  // ── Base Input Classes ────────────────────────────
  const baseInputClasses = [
    'w-full rounded-xl border',
    'text-gray-900 placeholder-gray-400',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'read-only:bg-gray-50 read-only:cursor-default',
    sizeClasses[size] ?? sizeClasses.md,
    leftPaddingClass,
    rightPaddingClass,
    getInputStateClasses(),
    inputClassName,
  ].filter(Boolean).join(' ')

  // ── Handle Clear ──────────────────────────────────
  const handleClear = () => {
    if (onClear) {
      onClear()
    } else if (onChange) {
      onChange({ target: { value: '', name } })
    }
  }

  // ── Should Show Clear Button ──────────────────────
  const showClear = clearable && value && value.length > 0 && !disabled

  // ── Unique ID ─────────────────────────────────────
  const inputId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-')

  // ── Render ───────────────────────────────────────
  return (
    <div className={[
      'flex flex-col gap-1.5',
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={[
            'font-medium text-gray-700',
            labelSizeClasses[size] ?? labelSizeClasses.md,
            disabled ? 'opacity-50' : '',
            labelClassName,
          ].filter(Boolean).join(' ')}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative flex items-center">

        {/* Left Icon */}
        {leftIcon && (
          <div className={[
            'absolute left-3 flex items-center justify-center',
            'text-gray-400 pointer-events-none',
            'z-10',
          ].join(' ')}>
            {leftIcon}
          </div>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          pattern={pattern}
          tabIndex={tabIndex}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={baseInputClasses}
          {...rest}
        />

        {/* Right Side Elements */}
        <div className="absolute right-3 flex items-center gap-1">

          {/* Loading Spinner */}
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          )}

          {/* Clear Button */}
          {!loading && showClear && (
            <button
              type="button"
              onClick={handleClear}
              className={[
                'flex items-center justify-center',
                'w-5 h-5 rounded-full',
                'text-gray-400 hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors duration-150',
                'focus:outline-none',
              ].join(' ')}
              aria-label="Clear input"
              tabIndex={-1}
            >
              <X size={12} />
            </button>
          )}

          {/* Password Toggle */}
          {!loading && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className={[
                'flex items-center justify-center',
                'text-gray-400 hover:text-gray-600',
                'transition-colors duration-150',
                'focus:outline-none',
              ].join(' ')}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword
                ? <EyeOff size={16} />
                : <Eye size={16} />
              }
            </button>
          )}

          {/* Custom Right Icon */}
          {!loading && rightIcon && type !== 'password' && !showClear && (
            <div className="text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* Error Icon */}
          {!loading && error && !showClear && type !== 'password' && (
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          )}

          {/* Success Icon */}
          {!loading && success && !error && !showClear && type !== 'password' && (
            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
          )}

        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1 text-xs text-red-500 font-medium animate-fade-in"
          role="alert"
        >
          <AlertCircle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && !error && (
        <p className="flex items-center gap-1 text-xs text-green-600 font-medium animate-fade-in">
          <CheckCircle2 size={12} className="flex-shrink-0" />
          {success}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && !success && (
        <p
          id={`${inputId}-helper`}
          className="text-xs text-gray-500"
        >
          {helperText}
        </p>
      )}

    </div>
  )
})

Input.displayName = 'Input'

export default Input

// ════════════════════════════════════════════════════
//  SEARCH INPUT
// ════════════════════════════════════════════════════
export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search donors by name, location...',
  loading     = false,
  className   = '',
  size        = 'md',
  autoFocus   = false,
}) => {
  return (
    <Input
      type="search"
      value={value}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder}
      loading={loading}
      clearable
      autoFocus={autoFocus}
      size={size}
      className={className}
      leftIcon={<Search size={16} />}
      autoComplete="off"
    />
  )
}

// ════════════════════════════════════════════════════
//  TEXTAREA COMPONENT
// ════════════════════════════════════════════════════
export const Textarea = ({
  label,
  placeholder   = '',
  value,
  onChange,
  onBlur,
  error         = '',
  helperText,
  disabled      = false,
  required      = false,
  rows          = 4,
  maxLength,
  className     = '',
  inputClassName = '',
  name,
  id,
}) => {
  const inputId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-')

  const getStateClasses = () => {
    if (disabled) return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
    if (error)    return 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
    return 'border-gray-200 bg-white hover:border-gray-300 focus:border-red-500 focus:ring-red-500'
  }

  return (
    <div className={['flex flex-col gap-1.5 w-full', className].join(' ')}>

      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={[
          'w-full rounded-xl border px-4 py-3',
          'text-sm text-gray-900 placeholder-gray-400',
          'transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          getStateClasses(),
          inputClassName,
        ].filter(Boolean).join(' ')}
      />

      {/* Character Count */}
      {maxLength && value && (
        <p className="text-xs text-gray-400 text-right">
          {value.length} / {maxLength}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1 text-xs text-red-500 font-medium"
          role="alert"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

    </div>
  )
}

// ════════════════════════════════════════════════════
//  SELECT INPUT
// ════════════════════════════════════════════════════
export const SelectInput = ({
  label,
  value,
  onChange,
  onBlur,
  options       = [],
  placeholder   = 'Select an option',
  error         = '',
  helperText,
  disabled      = false,
  required      = false,
  fullWidth     = true,
  size          = 'md',
  className     = '',
  name,
  id,
}) => {
  const inputId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-')

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
    <div className={[
      'flex flex-col gap-1.5',
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Select */}
      <select
        id={inputId}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={[
          'w-full rounded-xl border',
          'text-gray-900 appearance-none',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")]',
          'bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat',
          'pr-10',
          sizeClasses[size] ?? sizeClasses.md,
          getStateClasses(),
        ].filter(Boolean).join(' ')}
      >
        {/* Placeholder Option */}
        <option value="" disabled>
          {placeholder}
        </option>

        {/* Options */}
        {options.map(option => {
          const optValue = typeof option === 'object' ? option.value : option
          const optLabel = typeof option === 'object' ? option.label : option
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          )
        })}
      </select>

      {/* Error Message */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 font-medium" role="alert">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

    </div>
  )
}