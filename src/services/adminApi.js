import {
  getStoredDonors, setStoredDonors,
  getStoredUsers,  setStoredUsers,
  getItem, setItem,
  getCurrentUser, setCurrentUser,
} from '../utils/storage.js'
import donorsData from '../data/donors.json'
import usersData  from '../data/users.json'
import { db, isFirebaseEnabled } from './firebase.js'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { seedDatabaseIfEmpty } from './firebase.js'

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

// ── Donor Admin APIs ─────────────────────────────
export const adminGetAllDonors = async () => {
  await delay()
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, 'donors'))
    const list = []
    snap.forEach(dDoc => {
      list.push({ id: dDoc.id, ...dDoc.data() })
    })
    return list
  } else {
    return getStoredDonors() ?? donorsData
  }
}

export const adminDeleteDonor = async (id) => {
  await delay()
  if (isFirebaseEnabled && db) {
    await deleteDoc(doc(db, 'donors', id))
  } else {
    const donors  = getStoredDonors() ?? donorsData
    const updated = donors.filter(d => d.id !== id)
    setStoredDonors(updated)
  }
  return { success: true }
}

export const adminToggleDonorAvailability = async (id) => {
  await delay()
  if (isFirebaseEnabled && db) {
    const docRef = doc(db, 'donors', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error('Donor not found')
    const currentAvailability = docSnap.data().availability
    await updateDoc(docRef, { availability: !currentAvailability })
    return { id, ...docSnap.data(), availability: !currentAvailability }
  } else {
    const donors  = getStoredDonors() ?? donorsData
    const updated = donors.map(d =>
      d.id === id ? { ...d, availability: !d.availability } : d
    )
    setStoredDonors(updated)
    return updated.find(d => d.id === id)
  }
}

export const adminApproveDonor = async (donorId) => {
  await delay()
  if (isFirebaseEnabled && db) {
    const donorRef = doc(db, 'donors', donorId)
    const donorSnap = await getDoc(donorRef)
    if (!donorSnap.exists()) throw new Error('Donor not found')
    const dData = donorSnap.data()
    await updateDoc(donorRef, { status: 'approved' })
    if (dData.userId) {
      const userRef = doc(db, 'users', dData.userId)
      await updateDoc(userRef, { role: 'donor', donorStatus: 'approved' })
    }
    return { id: donorId, ...dData, status: 'approved' }
  } else {
    const donors = getStoredDonors() ?? donorsData
    const updatedDonors = donors.map(d =>
      d.id === donorId ? { ...d, status: 'approved' } : d
    )
    setStoredDonors(updatedDonors)
    const donor = updatedDonors.find(d => d.id === donorId)
    
    if (donor && donor.userId) {
      const users = getStoredUsers() ?? usersData
      const updatedUsers = users.map(u =>
        u.id === donor.userId ? { ...u, role: 'donor', donorStatus: 'approved' } : u
      )
      setStoredUsers(updatedUsers)
      
      const currentUser = getCurrentUser()
      if (currentUser && currentUser.id === donor.userId) {
        setCurrentUser({ ...currentUser, role: 'donor', donorStatus: 'approved' })
      }
    }
    return donor
  }
}

export const adminRejectDonor = async (donorId) => {
  await delay()
  if (isFirebaseEnabled && db) {
    const donorRef = doc(db, 'donors', donorId)
    const donorSnap = await getDoc(donorRef)
    if (!donorSnap.exists()) throw new Error('Donor not found')
    const dData = donorSnap.data()
    await updateDoc(donorRef, { status: 'rejected' })
    if (dData.userId) {
      const userRef = doc(db, 'users', dData.userId)
      await updateDoc(userRef, { role: 'user', donorStatus: 'rejected' })
    }
    return { id: donorId, ...dData, status: 'rejected' }
  } else {
    const donors = getStoredDonors() ?? donorsData
    const updatedDonors = donors.map(d =>
      d.id === donorId ? { ...d, status: 'rejected' } : d
    )
    setStoredDonors(updatedDonors)
    const donor = updatedDonors.find(d => d.id === donorId)
    
    if (donor && donor.userId) {
      const users = getStoredUsers() ?? usersData
      const updatedUsers = users.map(u =>
        u.id === donor.userId ? { ...u, role: 'user', donorStatus: 'rejected' } : u
      )
      setStoredUsers(updatedUsers)
      
      const currentUser = getCurrentUser()
      if (currentUser && currentUser.id === donor.userId) {
        setCurrentUser({ ...currentUser, role: 'user', donorStatus: 'rejected' })
      }
    }
    return donor
  }
}

// ── User Admin APIs ──────────────────────────────
export const adminGetAllUsers = async () => {
  await delay()
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, 'users'))
    const list = []
    snap.forEach(uDoc => {
      const { password: _, ...safe } = uDoc.data()
      list.push({ id: uDoc.id, ...safe })
    })
    return list
  } else {
    const users = getStoredUsers() ?? usersData
    return users.map(({ password: _, ...u }) => u)
  }
}

export const adminDeleteUser = async (id) => {
  await delay()
  if (isFirebaseEnabled && db) {
    await deleteDoc(doc(db, 'users', id))
  } else {
    const users   = getStoredUsers() ?? usersData
    const updated = users.filter(u => u.id !== id)
    setStoredUsers(updated)
  }
  return { success: true }
}

export const adminChangeUserRole = async (id, role) => {
  await delay()
  if (isFirebaseEnabled && db) {
    const docRef = doc(db, 'users', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error('User not found')
    await updateDoc(docRef, { role })
    const { password: _, ...safe } = { id, ...docSnap.data(), role }
    return safe
  } else {
    const users   = getStoredUsers() ?? usersData
    const updated = users.map(u =>
      u.id === id ? { ...u, role } : u
    )
    setStoredUsers(updated)
    const { password: _, ...safe } = updated.find(u => u.id === id)
    return safe
  }
}

// ── Contact Queries Admin APIs ───────────────────
export const adminGetAllQueries = async () => {
  await delay()
  if (isFirebaseEnabled && db) {
    const snap = await getDocs(collection(db, 'queries'))
    const list = []
    snap.forEach(qDoc => {
      list.push({ id: qDoc.id, ...qDoc.data() })
    })
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else {
    const queries = getItem('bc_queries') ?? []
    return queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export const adminDeleteQuery = async (id) => {
  await delay()
  if (isFirebaseEnabled && db) {
    await deleteDoc(doc(db, 'queries', id))
  } else {
    const queries = getItem('bc_queries') ?? []
    setItem('bc_queries', queries.filter(q => q.id !== id))
  }
  return { success: true }
}

export const adminResolveQuery = async (id, status = 'resolved') => {
  await delay()
  if (isFirebaseEnabled && db) {
    await updateDoc(doc(db, 'queries', id), { status })
  } else {
    const queries = getItem('bc_queries') ?? []
    setItem('bc_queries', queries.map(q => q.id === id ? { ...q, status } : q))
  }
  return { success: true }
}

// ── Stats ────────────────────────────────────────
export const adminGetStats = async () => {
  await delay()
  const donors = await adminGetAllDonors()
  const users = await adminGetAllUsers()
  const queries = await adminGetAllQueries()

  const pendingQueriesCount = queries.filter(q => q.status === 'pending').length
  const approvedDonors = donors.filter(d => !d.status || d.status === 'approved')
  const pendingApprovalsCount = donors.filter(d => d.status === 'pending').length

  return {
    totalDonors:     approvedDonors.length,
    availableDonors: approvedDonors.filter(d => d.availability).length,
    totalUsers:      users.length,
    totalDonations:  approvedDonors.reduce((s, d) => s + (d.donationsCount ?? 0), 0),
    totalQueries:    queries.length,
    pendingQueries:  pendingQueriesCount,
    pendingApprovals: pendingApprovalsCount,
    byBloodGroup:    approvedDonors.reduce((acc, d) => {
      acc[d.bloodGroup] = (acc[d.bloodGroup] ?? 0) + 1
      return acc
    }, {}),
    byCity: approvedDonors.reduce((acc, d) => {
      const city = d.location?.split(',')[0] ?? 'Unknown'
      acc[city] = (acc[city] ?? 0) + 1
      return acc
    }, {}),
  }
}

export const adminResetData = async () => {
  if (isFirebaseEnabled && db) {
    const donorsSnap = await getDocs(collection(db, 'donors'))
    for (const dDoc of donorsSnap.docs) {
      await deleteDoc(dDoc.ref)
    }
    const usersSnap = await getDocs(collection(db, 'users'))
    for (const uDoc of usersSnap.docs) {
      await deleteDoc(uDoc.ref)
    }
    const queriesSnap = await getDocs(collection(db, 'queries'))
    for (const qDoc of queriesSnap.docs) {
      await deleteDoc(qDoc.ref)
    }
    await seedDatabaseIfEmpty()
  } else {
    setStoredDonors(donorsData)
    setStoredUsers(usersData)
    setItem('bc_queries', [])
  }
  return { success: true }
}