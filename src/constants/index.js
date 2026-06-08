// ── Blood Groups ─────────────────────────────────────
export const BLOOD_GROUPS = [
  'A+', 'A-',
  'B+', 'B-',
  'AB+', 'AB-',
  'O+', 'O-',
]

// ── Blood Group Compatibility ─────────────────────────
export const BLOOD_COMPATIBILITY = {
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'] },
  'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'] },
  'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] },
}

// ── Cities ───────────────────────────────────────────
export const CITIES = [
  'Patna',
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Bhopal',
  'Indore',
  'Muzaffarpur',
  'Gaya',
  'Danapur',
  'Kankarbagh',
  'Bhagalpur',
]

// ── Gender Options ───────────────────────────────────
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
]

// ── Sort Options ─────────────────────────────────────
export const SORT_OPTIONS = [
  { label: 'Nearest First', value: 'nearest' },
  { label: 'Most Donations', value: 'donations' },
  { label: 'Recently Donated', value: 'recent' },
  { label: 'Name (A–Z)', value: 'name' },
]

// ── Toast Types ──────────────────────────────────────
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
}

// ── User Roles ───────────────────────────────────────
export const USER_ROLES = {
  USER: 'user',
  DONOR: 'donor',
  ADMIN: 'admin',
}

// ── Local Storage Keys ───────────────────────────────
export const STORAGE_KEYS = {
  CURRENT_USER: 'bc_current_user',
  DONORS: 'bc_donors',
  USERS: 'bc_users',
  FAVORITES: 'bc_favorites',
  THEME: 'bc_theme',
}

// ── Navigation Links ─────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Find Donors', path: '/find-donors' },
  { label: 'Become Donor', path: '/register-donor' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

// ── FAQ Data ─────────────────────────────────────────
export const FAQ_DATA = [
  {
    id: 'f1',
    question: 'Who can donate blood?',
    answer:
      'Anyone between 18–65 years of age, weighing at least 50kg, and in good health can donate blood. You should not have donated blood in the last 3 months.',
  },
  {
    id: 'f2',
    question: 'How can I search for donors?',
    answer:
      'Go to the Find Donors page, enter your blood group and location, and our system will show you a list of available donors near you.',
  },
  {
    id: 'f3',
    question: 'Is my information safe?',
    answer:
      'Yes, your personal information is stored securely and only your name, blood group, and location are visible to people searching for donors.',
  },
  {
    id: 'f4',
    question: 'How do I register as a donor?',
    answer:
      'Click on "Become a Donor" in the navigation, fill in your details including blood group and location, and submit the form. You will be listed as an available donor immediately.',
  },
  {
    id: 'f5',
    question: 'How can I contact a donor?',
    answer:
      'Once you find a donor, click on their card to view their profile. You will find a Call and Message button to contact them directly.',
  },
  {
    id: 'f6',
    question: 'How often can I donate blood?',
    answer:
      'You can donate whole blood every 3 months (90 days). Regular donation is safe and beneficial for both the donor and recipient.',
  },
  {
    id: 'f7',
    question: 'Can I toggle my availability?',
    answer:
      'Yes! After logging in, go to your Profile page and you can toggle your availability status on or off at any time.',
  },
  {
    id: 'f8',
    question: 'Is BloodConnect free to use?',
    answer:
      'Absolutely. BloodConnect is a free platform dedicated to saving lives by connecting donors with recipients quickly and easily.',
  },
]

// ── Features List (Home Page) ────────────────────────
export const HOME_FEATURES = [
  {
    id: 'hf1',
    icon: 'search',
    title: 'Quick Search',
    description: 'Find donors near you in seconds by blood group and location.',
  },
  {
    id: 'hf2',
    icon: 'shield',
    title: 'Verified Donors',
    description: 'We verify all donors for safety and trust.',
  },
  {
    id: 'hf3',
    icon: 'clock',
    title: '24×7 Availability',
    description: 'Get help anytime, anywhere — emergencies don\'t wait.',
  },
  {
    id: 'hf4',
    icon: 'heart',
    title: 'Save Lives',
    description: 'Your one search can save a precious life today.',
  },
]

// ── Why Donate (About Page) ──────────────────────────
export const WHY_DONATE = [
  {
    id: 'wd1',
    icon: 'heart',
    title: 'Saves Lives',
    description: 'One donation can save up to 3 lives.',
    color: 'red',
  },
  {
    id: 'wd2',
    icon: 'activity',
    title: 'Good for Health',
    description: 'Regular donation is good for your heart.',
    color: 'green',
  },
  {
    id: 'wd3',
    icon: 'users',
    title: 'Builds Community',
    description: 'We are stronger when we help others.',
    color: 'blue',
  },
  {
    id: 'wd4',
    icon: 'shield',
    title: 'Reduces Risk',
    description: 'Lower risk of heart attacks and cancer.',
    color: 'purple',
  },
]

// ── Stats (Home / About Page) ────────────────────────
export const APP_STATS = [
  { id: 's1', value: '2.5K+', label: 'Registered Donors' },
  { id: 's2', value: '1.2K+', label: 'Lives Saved' },
  { id: 's3', value: '50+', label: 'Cities Covered' },
  { id: 's4', value: '24/7', label: 'Available Support' },
]

// ── Social Links ─────────────────────────────────────
export const SOCIAL_LINKS = [
  { id: 'sl1', platform: 'Facebook', url: 'https://www.facebook.com/sridhar.sharma.7399', icon: 'facebook' },
  { id: 'sl2', platform: 'Instagram', url: 'https://www.instagram.com/sridhar_kr_06/', icon: 'instagram' },
  { id: 'sl3', platform: 'Twitter', url: 'https://x.com/SridharSha10025', icon: 'twitter' },
  { id: 'sl4', platform: 'YouTube', url: 'https://www.youtube.com/@sridharsharma7163', icon: 'youtube' },
]

// ── Contact Info ─────────────────────────────────────
export const CONTACT_INFO = {
  phone: '+91 9153336206',
  email: 'sri9153336206@gmail.com',
  location: 'Patna, Bihar, India',
}

// ── App Meta ─────────────────────────────────────────
export const APP_META = {
  name: 'BloodConnect',
  tagline: 'Find Blood. Save Lives.',
  description: 'BloodConnect is a platform that connects voluntary blood donors with people in need.',
  version: '1.0.0',
}