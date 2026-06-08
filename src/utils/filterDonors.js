// ── Main Filter Function ─────────────────────────────
export const filterDonors = (
  donors,
  {
    query         = '',
    bloodGroup    = '',
    location      = '',
    availableOnly = false,
    sortBy        = 'nearest',
  } = {}
) => {
  if (!Array.isArray(donors)) return []

  let result = [...donors]

  // ── Step 1: Search Query Filter ────────────────────
  // matches name, location, or blood group
  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter(donor => {
      const inName       = donor.name?.toLowerCase().includes(q)
      const inLocation   = donor.location?.toLowerCase().includes(q)
      const inBloodGroup = donor.bloodGroup?.toLowerCase().includes(q)
      return inName || inLocation || inBloodGroup
    })
  }

  // ── Step 2: Blood Group Filter ─────────────────────
  if (bloodGroup.trim()) {
    result = result.filter(
      donor => donor.bloodGroup === bloodGroup.trim()
    )
  }

  // ── Step 3: Location Filter ────────────────────────
  if (location.trim()) {
    const loc = location.trim().toLowerCase()
    result = result.filter(
      donor => donor.location?.toLowerCase().includes(loc)
    )
  }

  // ── Step 4: Availability Filter ────────────────────
  if (availableOnly) {
    result = result.filter(
      donor => donor.availability === true
    )
  }

  // ── Step 5: Sort ───────────────────────────────────
  result = sortDonors(result, sortBy)

  return result
}

// ── Sort Donors ──────────────────────────────────────
export const sortDonors = (donors, sortBy = 'nearest') => {
  const sorted = [...donors]

  switch (sortBy) {
    // most donations count first
    case 'donations':
      sorted.sort((a, b) =>
        (b.donationsCount ?? 0) - (a.donationsCount ?? 0)
      )
      break

    // most recently donated first
    case 'recent':
      sorted.sort((a, b) => {
        const dateA = a.lastDonationDate ? new Date(a.lastDonationDate) : new Date(0)
        const dateB = b.lastDonationDate ? new Date(b.lastDonationDate) : new Date(0)
        return dateB - dateA
      })
      break

    // alphabetical by name
    case 'name':
      sorted.sort((a, b) =>
        (a.name ?? '').localeCompare(b.name ?? '')
      )
      break

    // available donors first, then by name
    case 'nearest':
    default:
      sorted.sort((a, b) => {
        if (a.availability === b.availability) {
          return (a.name ?? '').localeCompare(b.name ?? '')
        }
        return a.availability ? -1 : 1
      })
      break
  }

  return sorted
}

// ── Filter By Blood Group Only ───────────────────────
export const filterByBloodGroup = (donors, bloodGroup) => {
  if (!bloodGroup || !Array.isArray(donors)) return donors
  return donors.filter(d => d.bloodGroup === bloodGroup)
}

// ── Filter By Location Only ──────────────────────────
export const filterByLocation = (donors, location) => {
  if (!location || !Array.isArray(donors)) return donors
  const loc = location.trim().toLowerCase()
  return donors.filter(d =>
    d.location?.toLowerCase().includes(loc)
  )
}

// ── Filter Available Only ────────────────────────────
export const filterAvailableOnly = (donors) => {
  if (!Array.isArray(donors)) return []
  return donors.filter(d => d.availability === true)
}

// ── Get Donors By Blood Group Compatibility ──────────
// returns donors who can donate TO the given blood group
export const getCompatibleDonors = (donors, recipientBloodGroup) => {
  if (!recipientBloodGroup || !Array.isArray(donors)) return donors

  const compatibilityMap = {
    'A+':  ['A+', 'A-', 'O+', 'O-'],
    'A-':  ['A-', 'O-'],
    'B+':  ['B+', 'B-', 'O+', 'O-'],
    'B-':  ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+':  ['O+', 'O-'],
    'O-':  ['O-'],
  }

  const compatibleGroups = compatibilityMap[recipientBloodGroup] ?? []
  return donors.filter(d =>
    compatibleGroups.includes(d.bloodGroup)
  )
}

// ── Search Donors By Name ────────────────────────────
export const searchByName = (donors, query) => {
  if (!query || !Array.isArray(donors)) return donors
  const q = query.trim().toLowerCase()
  return donors.filter(d =>
    d.name?.toLowerCase().includes(q)
  )
}

// ── Get Unique Locations From Donors ─────────────────
export const getUniqueLocations = (donors) => {
  if (!Array.isArray(donors)) return []
  const locations = donors
    .map(d => d.location)
    .filter(Boolean)
  return [...new Set(locations)].sort()
}

// ── Get Unique Blood Groups From Donors ───────────────
export const getUniqueBloodGroups = (donors) => {
  if (!Array.isArray(donors)) return []
  const groups = donors
    .map(d => d.bloodGroup)
    .filter(Boolean)
  return [...new Set(groups)]
}

// ── Get Available Donors Count ───────────────────────
export const getAvailableCount = (donors) => {
  if (!Array.isArray(donors)) return 0
  return donors.filter(d => d.availability === true).length
}

// ── Get Donors Count By Blood Group ──────────────────
export const getCountByBloodGroup = (donors) => {
  if (!Array.isArray(donors)) return {}
  return donors.reduce((acc, donor) => {
    const group = donor.bloodGroup
    if (group) {
      acc[group] = (acc[group] ?? 0) + 1
    }
    return acc
  }, {})
}

// ── Check If Filters Are Active ───────────────────────
export const hasActiveFilters = (filters) => {
  return (
    filters.query?.trim()      !== '' ||
    filters.bloodGroup?.trim() !== '' ||
    filters.location?.trim()   !== '' ||
    filters.availableOnly      === true
  )
}

// ── Get Filter Summary Text ───────────────────────────
// e.g. "Showing 5 donors · A+ · Patna · Available only"
export const getFilterSummary = (count, filters) => {
  const parts = [`${count} donor${count !== 1 ? 's' : ''} found`]

  if (filters.bloodGroup) parts.push(filters.bloodGroup)
  if (filters.location)   parts.push(filters.location)
  if (filters.availableOnly) parts.push('Available only')

  return parts.join(' · ')
}