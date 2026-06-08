// ── Name Validation ──────────────────────────────────
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required'
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters'
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return 'Name can only contain letters and spaces'
  }
  return ''
}

// ── Email Validation ─────────────────────────────────
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please enter a valid email address'
  }
  if (email.trim().length > 100) {
    return 'Email must be less than 100 characters'
  }
  return ''
}

// ── Password Validation ──────────────────────────────
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  if (password.length > 50) {
    return 'Password must be less than 50 characters'
  }
  return ''
}

// ── Confirm Password Validation ──────────────────────
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Please confirm your password'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return ''
}

// ── Phone Validation ─────────────────────────────────
export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return 'Phone number is required'
  }
  const cleaned = phone.trim().replace(/\s+/g, '')
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return 'Please enter a valid 10-digit Indian mobile number'
  }
  return ''
}

// ── Age Validation ───────────────────────────────────
export const validateAge = (age) => {
  if (!age || age.toString().trim().length === 0) {
    return 'Age is required'
  }
  const parsed = parseInt(age, 10)
  if (isNaN(parsed)) {
    return 'Please enter a valid age'
  }
  if (parsed < 18) {
    return 'You must be at least 18 years old to donate'
  }
  if (parsed > 65) {
    return 'Age must be 65 or below to donate'
  }
  return ''
}

// ── Blood Group Validation ───────────────────────────
export const validateBloodGroup = (bloodGroup) => {
  const valid = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  if (!bloodGroup || bloodGroup.trim().length === 0) {
    return 'Blood group is required'
  }
  if (!valid.includes(bloodGroup.trim())) {
    return 'Please select a valid blood group'
  }
  return ''
}

// ── Location Validation ──────────────────────────────
export const validateLocation = (location) => {
  if (!location || location.trim().length === 0) {
    return 'Location is required'
  }
  if (location.trim().length < 2) {
    return 'Please enter a valid location'
  }
  if (location.trim().length > 100) {
    return 'Location must be less than 100 characters'
  }
  return ''
}

// ── Gender Validation ────────────────────────────────
export const validateGender = (gender) => {
  const valid = ['Male', 'Female', 'Other']
  if (!gender || gender.trim().length === 0) {
    return 'Gender is required'
  }
  if (!valid.includes(gender)) {
    return 'Please select a valid gender'
  }
  return ''
}

// ── Message Validation ───────────────────────────────
export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return 'Message is required'
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters'
  }
  if (message.trim().length > 500) {
    return 'Message must be less than 500 characters'
  }
  return ''
}

// ── About / Bio Validation ───────────────────────────
export const validateAbout = (about) => {
  if (!about || about.trim().length === 0) {
    return ''
  }
  if (about.trim().length > 300) {
    return 'Bio must be less than 300 characters'
  }
  return ''
}

// ── Login Form Validation ────────────────────────────
export const validateLoginForm = ({ email, password }) => {
  const errors = {}
  const emailError    = validateEmail(email)
  const passwordError = validatePassword(password)
  if (emailError)    errors.email    = emailError
  if (passwordError) errors.password = passwordError
  return errors
}

// ── Signup Form Validation ───────────────────────────
export const validateSignupForm = ({ name, email, password, confirmPassword, phone }) => {
  const errors = {}
  const nameError            = validateName(name)
  const emailError           = validateEmail(email)
  const passwordError        = validatePassword(password)
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
  const phoneError           = validatePhone(phone)
  if (nameError)            errors.name            = nameError
  if (emailError)           errors.email           = emailError
  if (passwordError)        errors.password        = passwordError
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  if (phoneError)           errors.phone           = phoneError
  return errors
}

// ── Register Donor Form Validation ───────────────────
export const validateDonorForm = ({
  name,
  bloodGroup,
  gender,
  location,
  phone,
  age,
  about,
}) => {
  const errors = {}
  const nameError       = validateName(name)
  const bloodGroupError = validateBloodGroup(bloodGroup)
  const genderError     = validateGender(gender)
  const locationError   = validateLocation(location)
  const phoneError      = validatePhone(phone)
  const ageError        = validateAge(age)
  const aboutError      = validateAbout(about)
  if (nameError)       errors.name       = nameError
  if (bloodGroupError) errors.bloodGroup = bloodGroupError
  if (genderError)     errors.gender     = genderError
  if (locationError)   errors.location   = locationError
  if (phoneError)      errors.phone      = phoneError
  if (ageError)        errors.age        = ageError
  if (aboutError)      errors.about      = aboutError
  return errors
}

// ── Contact Form Validation ──────────────────────────
export const validateContactForm = ({ name, email, message }) => {
  const errors = {}
  const nameError    = validateName(name)
  const emailError   = validateEmail(email)
  const messageError = validateMessage(message)
  if (nameError)    errors.name    = nameError
  if (emailError)   errors.email   = emailError
  if (messageError) errors.message = messageError
  return errors
}

// ── Profile Form Validation ──────────────────────────
export const validateProfileForm = ({ name, phone, location, bloodGroup }) => {
  const errors = {}
  const nameError       = validateName(name)
  const phoneError      = validatePhone(phone)
  const locationError   = validateLocation(location)
  const bloodGroupError = validateBloodGroup(bloodGroup)
  if (nameError)       errors.name       = nameError
  if (phoneError)      errors.phone      = phoneError
  if (locationError)   errors.location   = locationError
  if (bloodGroupError) errors.bloodGroup = bloodGroupError
  return errors
}

// ── Check If Form Has Errors ─────────────────────────
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== '')
}

// ── Format Phone For Display ─────────────────────────
export const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.toString().replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

// ── Format Date For Display ──────────────────────────
export const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    })
  } catch {
    return dateString
  }
}

// ── Get Days Since Last Donation ─────────────────────
export const daysSinceLastDonation = (dateString) => {
  if (!dateString) return null
  try {
    const last  = new Date(dateString)
    const today = new Date()
    const diff  = Math.floor((today - last) / (1000 * 60 * 60 * 24))
    return diff
  } catch {
    return null
  }
}

// ── Check If Eligible To Donate ──────────────────────
export const isEligibleToDonate = (lastDonationDate) => {
  const days = daysSinceLastDonation(lastDonationDate)
  if (days === null) return true
  return days >= 90
}