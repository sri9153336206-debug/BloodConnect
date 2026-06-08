import donorsData from '../data/donors.json'
import usersData from '../data/users.json'
import {
  getItem,
  setItem,
  getStoredDonors,
  getStoredUsers,
  setStoredDonors,
  setStoredUsers,
} from '../utils/storage.js'
import { STORAGE_KEYS } from '../constants/index.js'
import { db, auth, isFirebaseEnabled, seedDatabaseIfEmpty, GoogleAuthProvider, signInWithPopup } from './firebase.js'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword as updateAuthPassword,
  deleteUser as deleteAuthUser,
} from 'firebase/auth'

// ── Google Sign-In ────────────────────────────────────
export const loginWithGoogle = async () => {
  if (!isFirebaseEnabled || !db || !auth) {
    throw new Error('Google Sign-In is only available when Firebase is enabled.')
  }
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user
    const uid = firebaseUser.uid

    const docRef = doc(db, 'users', uid)
    const docSnap = await import('firebase/firestore').then(m => m.getDoc(docRef))

    if (docSnap.exists()) {
      const { password: _, ...safeUser } = { id: docSnap.id, ...docSnap.data() }
      return safeUser
    }

    // New Google user — auto-create their profile
    const newUser = {
      id: uid,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      email: firebaseUser.email.toLowerCase(),
      phone: firebaseUser.phoneNumber || '',
      bloodGroup: '',
      location: '',
      role: 'user',
      favorites: [],
      donorId: null,
      photoUrl: firebaseUser.photoURL || '',
      createdAt: new Date().toISOString().split('T')[0],
    }
    await import('firebase/firestore').then(m => m.setDoc(docRef, newUser))
    return newUser
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      throw new Error('Google sign-in was cancelled.')
    }
    throw new Error(error.message || 'Google sign-in failed.')
  }
}

// ── Simulate Network Delay ───────────────────────────
const delay = (ms = 400) =>
  new Promise(resolve => setTimeout(resolve, ms))

// ── Initialize Storage With JSON Data ───────────────
export const initializeStorage = async () => {
  if (isFirebaseEnabled) {
    await seedDatabaseIfEmpty()
  } else {
    if (!getStoredDonors()) {
      setStoredDonors(donorsData)
    }
    if (!getStoredUsers()) {
      setStoredUsers(usersData)
    }
  }
}

// ════════════════════════════════════════════════════
//  DONOR APIs
// ════════════════════════════════════════════════════

// ── Get All Donors ───────────────────────────────────
export const getAllDonors = async () => {
  await delay(400)
  try {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'donors'))
      const list = []
      snap.forEach(docSnap => {
        const data = docSnap.data()
        if (!data.status || data.status === 'approved') {
          list.push({ id: docSnap.id, ...data })
        }
      })
      return list
    } else {
      const stored = getStoredDonors() ?? donorsData
      return stored.filter(d => !d.status || d.status === 'approved')
    }
  } catch (error) {
    throw new Error('Failed to fetch donors. Please try again.')
  }
}

// ── Get Single Donor By ID ───────────────────────────
export const getDonorById = async (id) => {
  await delay(300)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'donors', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('Donor not found')
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      const donors = getStoredDonors() ?? donorsData
      const donor = donors.find(d => d.id === id)
      if (!donor) throw new Error('Donor not found')
      return donor
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch donor details.')
  }
}

// ── Register New Donor ───────────────────────────────
export const registerDonor = async (donorData) => {
  await delay(600)
  try {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'donors'), where('phone', '==', donorData.phone))
      const snap = await getDocs(q)
      if (!snap.empty) {
        throw new Error('This phone number is already registered as a donor.')
      }

      const newId = 'd' + Date.now()
      const newDonor = {
        ...donorData,
        id: newId,
        status: 'pending',
        donationsCount: 0,
        lastDonationDate: null,
        availability: donorData.availability ?? true,
        photoUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(donorData.name)}`,
        createdAt: new Date().toISOString().split('T')[0],
      }

      await setDoc(doc(db, 'donors', newId), newDonor)
      return newDonor
    } else {
      const donors = getStoredDonors() ?? donorsData
      const phoneExists = donors.find(d => d.phone === donorData.phone)
      if (phoneExists) {
        throw new Error('This phone number is already registered as a donor.')
      }

      const newDonor = {
        ...donorData,
        id: 'd' + Date.now(),
        status: 'pending',
        donationsCount: 0,
        lastDonationDate: null,
        availability: donorData.availability ?? true,
        photoUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(donorData.name)}`,
        createdAt: new Date().toISOString().split('T')[0],
      }

      setStoredDonors([...donors, newDonor])
      return newDonor
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to register donor.')
  }
}

// ── Update Donor ─────────────────────────────────────
export const updateDonor = async (id, updates) => {
  await delay(500)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'donors', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('Donor not found')

      const updated = { ...docSnap.data(), ...updates }
      await updateDoc(docRef, updates)
      return { id, ...updated }
    } else {
      const donors = getStoredDonors() ?? donorsData
      const index = donors.findIndex(d => d.id === id)
      if (index === -1) throw new Error('Donor not found')

      const updatedDonor = { ...donors[index], ...updates }
      const updatedDonors = [...donors]
      updatedDonors[index] = updatedDonor

      setStoredDonors(updatedDonors)
      return updatedDonor
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to update donor.')
  }
}

// ── Toggle Donor Availability ────────────────────────
export const toggleDonorAvailability = async (id) => {
  await delay(300)
  try {
    const donor = await getDonorById(id)
    if (!donor) throw new Error('Donor not found')
    return await updateDonor(id, { availability: !donor.availability })
  } catch (error) {
    throw new Error(error.message || 'Failed to toggle availability.')
  }
}

// ── Delete Donor ─────────────────────────────────────
export const deleteDonor = async (id) => {
  await delay(400)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'donors', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('Donor not found')
      await deleteDoc(docRef)
      return { success: true, message: 'Donor removed successfully.' }
    } else {
      const donors = getStoredDonors() ?? donorsData
      const filtered = donors.filter(d => d.id !== id)
      if (filtered.length === donors.length) {
        throw new Error('Donor not found')
      }
      setStoredDonors(filtered)
      return { success: true, message: 'Donor removed successfully.' }
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to delete donor.')
  }
}

// ── Get Donors By Blood Group ────────────────────────
export const getDonorsByBloodGroup = async (bloodGroup) => {
  await delay(350)
  try {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'donors'), where('bloodGroup', '==', bloodGroup))
      const snap = await getDocs(q)
      const list = []
      snap.forEach(dDoc => {
        list.push({ id: dDoc.id, ...dDoc.data() })
      })
      return list
    } else {
      const donors = getStoredDonors() ?? donorsData
      return donors.filter(d => d.bloodGroup === bloodGroup)
    }
  } catch (error) {
    throw new Error('Failed to fetch donors by blood group.')
  }
}

// ── Get Available Donors ─────────────────────────────
export const getAvailableDonors = async () => {
  await delay(350)
  try {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'donors'), where('availability', '==', true))
      const snap = await getDocs(q)
      const list = []
      snap.forEach(dDoc => {
        list.push({ id: dDoc.id, ...dDoc.data() })
      })
      return list
    } else {
      const donors = getStoredDonors() ?? donorsData
      return donors.filter(d => d.availability === true)
    }
  } catch (error) {
    throw new Error('Failed to fetch available donors.')
  }
}

// ════════════════════════════════════════════════════
//  AUTH APIs
// ════════════════════════════════════════════════════

// ── Get User By ID ───────────────────────────────────
export const getUserById = async (id) => {
  await delay(200)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        const firebaseUser = auth?.currentUser
        if (firebaseUser && firebaseUser.uid === id) {
          const defaultProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            role: 'user',
            phone: firebaseUser.phoneNumber || '',
            bloodGroup: '',
            location: '',
            favorites: [],
            donorId: null,
            createdAt: new Date().toISOString().split('T')[0]
          }
          await setDoc(docRef, defaultProfile)
          return defaultProfile
        }
        throw new Error('User not found')
      }
      const { password: _, ...safeUser } = { id: docSnap.id, ...docSnap.data() }
      return safeUser
    } else {
      const users = getStoredUsers() ?? usersData
      const user = users.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      const { password: _, ...safeUser } = user
      return safeUser
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user profile.')
  }
}

// ── Login ────────────────────────────────────────────
export const loginUser = async (email, password) => {
  await delay(500)
  try {
    if (isFirebaseEnabled && db && auth) {
      let userCredential
      try {
        userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password)
      } catch (authError) {
        const isUserNotFound = authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential'
        if (isUserNotFound) {
          const seedUser = usersData.find(
            u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
          )
          if (seedUser) {
            console.log(`[Firebase] Auto-registering seed user: ${email}`)
            userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password)
            const { password: _, ...profile } = seedUser
            const newUserProfile = {
              ...profile,
              id: userCredential.user.uid,
            }
            await setDoc(doc(db, 'users', userCredential.user.uid), newUserProfile)
            return newUserProfile
          }
        }

        // Check if email exists in Firestore to give precise feedback
        if (
          authError.code === 'auth/wrong-password' ||
          authError.code === 'auth/invalid-credential' ||
          authError.code === 'auth/user-not-found'
        ) {
          const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase().trim()))
          const querySnap = await getDocs(q)
          if (querySnap.empty) {
            throw new Error('Email not found. Please check your email address.')
          } else {
            throw new Error('Incorrect password. Please try again.')
          }
        }
        throw authError
      }

      const uid = userCredential.user.uid
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        const defaultProfile = {
          id: uid,
          name: email.split('@')[0],
          email: email.toLowerCase().trim(),
          role: 'user',
          phone: '',
          bloodGroup: '',
          location: '',
          favorites: [],
          donorId: null,
          createdAt: new Date().toISOString().split('T')[0]
        }
        await setDoc(docRef, defaultProfile)
        return defaultProfile
      }

      const { password: _, ...safeUser } = { id: docSnap.id, ...docSnap.data() }
      return safeUser
    } else {
      const users = getStoredUsers() ?? usersData
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())
      if (!emailExists) {
        throw new Error('Email not found. Please check your email address.')
      }

      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() &&
          u.password === password
      )
      if (!user) {
        throw new Error('Incorrect password. Please try again.')
      }

      const { password: _, ...safeUser } = user
      return safeUser
    }
  } catch (error) {
    if (
      error.message === 'Email not found. Please check your email address.' ||
      error.message === 'Incorrect password. Please try again.'
    ) {
      throw error
    }
    let msg = 'An error occurred during login. Please try again later.'
    if (error.code === 'auth/invalid-email') {
      msg = 'Email not found. Please check your email address.'
    }
    throw new Error(msg)
  }
}

// ── Register New User ────────────────────────────────
export const registerUser = async (userData) => {
  await delay(600)
  try {
    if (isFirebaseEnabled && db && auth) {
      console.log('[Auth] Attempting Firebase registration for:', userData.email)

      // Step 1: Create the Firebase Auth account FIRST.
      // This authenticates the user so subsequent Firestore reads/writes work.
      let userCredential
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email.toLowerCase().trim(),
          userData.password
        )
      } catch (authError) {
        console.error('[Auth] Firebase Auth error:', authError.code, authError.message)
        throw authError
      }

      const uid = userCredential.user.uid
      console.log('[Auth] Firebase Auth account created, uid:', uid)

      // Step 2: Check for duplicate phone number in Firestore (now authenticated)
      try {
        const qPhone = query(
          collection(db, 'users'),
          where('phone', '==', userData.phone.trim())
        )
        const phoneSnap = await getDocs(qPhone)
        if (!phoneSnap.empty) {
          // Roll back: delete the just-created auth account
          await deleteAuthUser(userCredential.user)
          throw new Error('This phone number is already registered.')
        }
      } catch (phoneCheckError) {
        if (phoneCheckError.message === 'This phone number is already registered.') {
          throw phoneCheckError
        }
        // If Firestore check fails for other reasons, proceed anyway
        console.warn('[Auth] Phone duplicate check failed, proceeding:', phoneCheckError.message)
      }

      // Step 3: Write the user profile document to Firestore
      const newUser = {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone.trim(),
        bloodGroup: userData.bloodGroup || '',
        location: userData.location || '',
        id: uid,
        role: 'user',
        favorites: [],
        donorId: null,
        createdAt: new Date().toISOString().split('T')[0],
      }

      await setDoc(doc(db, 'users', uid), newUser)
      console.log('[Auth] Firestore profile saved for uid:', uid)

      const { password: _, ...safeUser } = newUser
      return safeUser
    } else {
      const users = getStoredUsers() ?? usersData

      const emailExists = users.find(
        u => u.email.toLowerCase() === userData.email.toLowerCase().trim()
      )
      if (emailExists) {
        throw new Error('This email is already registered. Please login instead.')
      }

      const phoneExists = users.find(u => u.phone === userData.phone)
      if (phoneExists) {
        throw new Error('This phone number is already registered.')
      }

      const newUser = {
        ...userData,
        id: 'u' + Date.now(),
        role: 'user',
        favorites: [],
        donorId: null,
        createdAt: new Date().toISOString().split('T')[0],
      }

      setStoredUsers([...users, newUser])
      const { password: _, ...safeUser } = newUser
      return safeUser
    }
  } catch (error) {
    console.error('[Auth] Registration error:', error.code, error.message)
    let msg = error.message
    if (error.code === 'auth/email-already-in-use') {
      msg = 'This email is already registered. Please login instead.'
    } else if (error.code === 'auth/weak-password') {
      msg = 'Password should be at least 6 characters.'
    } else if (error.code === 'auth/invalid-email') {
      msg = 'Please enter a valid email address.'
    } else if (error.code === 'auth/operation-not-allowed') {
      msg = 'Email/Password sign-in is not enabled. Please enable it in the Firebase Console under Authentication → Sign-in method.'
    } else if (error.code === 'auth/network-request-failed') {
      msg = 'Network error. Please check your internet connection and try again.'
    } else if (error.code === 'auth/too-many-requests') {
      msg = 'Too many attempts. Please try again later.'
    }
    throw new Error(msg)
  }
}

// ── Update User Profile ──────────────────────────────
export const updateUser = async (id, updates) => {
  await delay(500)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('User not found')

      const updated = { ...docSnap.data(), ...updates }
      await updateDoc(docRef, updates)
      const { password: _, ...safeUser } = { id, ...updated }
      return safeUser
    } else {
      const users = getStoredUsers() ?? usersData
      const index = users.findIndex(u => u.id === id)
      if (index === -1) throw new Error('User not found')

      const updatedUser = { ...users[index], ...updates }
      const updatedUsers = [...users]
      updatedUsers[index] = updatedUser

      setStoredUsers(updatedUsers)
      const { password: _, ...safeUser } = updatedUser
      return safeUser
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile.')
  }
}

// ── Change Password ──────────────────────────────────
export const changePassword = async (id, currentPassword, newPassword) => {
  await delay(500)
  try {
    if (isFirebaseEnabled && db && auth) {
      const firebaseUser = auth.currentUser
      if (!firebaseUser) throw new Error('No authenticated user found.')

      try {
        await updateAuthPassword(firebaseUser, newPassword)
      } catch (authErr) {
        if (authErr.code === 'auth/requires-recent-login') {
          throw new Error('For security reasons, please log out and log back in to change your password.')
        }
        throw authErr
      }

      // Also update Firestore password field if it exists for compatibility
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.password) {
          await updateDoc(docRef, { password: newPassword })
        }
      }

      return await getUserById(id)
    } else {
      const users = getStoredUsers() ?? usersData
      const user = users.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      if (user.password !== currentPassword) {
        throw new Error('Current password is incorrect.')
      }

      return await updateUser(id, { password: newPassword })
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to change password.')
  }
}

// ── Delete User Account ──────────────────────────────
export const deleteUser = async (id) => {
  await delay(400)
  try {
    if (isFirebaseEnabled && db && auth) {
      const firebaseUser = auth.currentUser
      if (firebaseUser && firebaseUser.uid === id) {
        try {
          await deleteAuthUser(firebaseUser)
        } catch (authErr) {
          if (authErr.code === 'auth/requires-recent-login') {
            throw new Error('For security reasons, please log out and log back in to delete your account.')
          }
          throw authErr
        }
      }

      const docRef = doc(db, 'users', id)
      await deleteDoc(docRef)
      return { success: true, message: 'Account deleted successfully.' }
    } else {
      const users = getStoredUsers() ?? usersData
      const filtered = users.filter(u => u.id !== id)
      if (filtered.length === users.length) {
        throw new Error('User not found')
      }
      setStoredUsers(filtered)
      return { success: true, message: 'Account deleted successfully.' }
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to delete account.')
  }
}

// ════════════════════════════════════════════════════
//  FAVORITES APIs
// ════════════════════════════════════════════════════

// ── Get User Favorites ───────────────────────────────
export const getUserFavorites = async (userId) => {
  await delay(300)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('User not found')
      return docSnap.data().favorites ?? []
    } else {
      const users = getStoredUsers() ?? usersData
      const user = users.find(u => u.id === userId)
      if (!user) throw new Error('User not found')
      return user.favorites ?? []
    }
  } catch (error) {
    throw new Error('Failed to fetch favorites.')
  }
}

// ── Add To Favorites ─────────────────────────────────
export const addToFavorites = async (userId, donorId) => {
  await delay(200)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('User not found')
      const favorites = docSnap.data().favorites ?? []
      if (favorites.includes(donorId)) return favorites
      const updated = [...favorites, donorId]
      await updateDoc(docRef, { favorites: updated })
      return updated
    } else {
      const users = getStoredUsers() ?? usersData
      const user = users.find(u => u.id === userId)
      if (!user) throw new Error('User not found')

      const favorites = user.favorites ?? []
      if (favorites.includes(donorId)) return favorites

      const updated = [...favorites, donorId]
      await updateUser(userId, { favorites: updated })
      return updated
    }
  } catch (error) {
    throw new Error('Failed to add to favorites.')
  }
}

// ── Remove From Favorites ────────────────────────────
export const removeFromFavorites = async (userId, donorId) => {
  await delay(200)
  try {
    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('User not found')
      const favorites = docSnap.data().favorites ?? []
      const updated = favorites.filter(id => id !== donorId)
      await updateDoc(docRef, { favorites: updated })
      return updated
    } else {
      const users = getStoredUsers() ?? usersData
      const user = users.find(u => u.id === userId)
      if (!user) throw new Error('User not found')

      const updated = (user.favorites ?? []).filter(id => id !== donorId)
      await updateUser(userId, { favorites: updated })
      return updated
    }
  } catch (error) {
    throw new Error('Failed to remove from favorites.')
  }
}

// ── Submit Contact Query ──────────────────────────────
export const submitContactQuery = async (queryData) => {
  await delay(400)
  try {
    const queryDoc = {
      ...queryData,
      id: 'q' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'queries', queryDoc.id), queryDoc)
    } else {
      const queries = getItem('bc_queries') ?? []
      setItem('bc_queries', [...queries, queryDoc])
    }
    return queryDoc
  } catch (error) {
    throw new Error(error.message || 'Failed to submit query.')
  }
}

// ════════════════════════════════════════════════════
//  STATS APIs
// ════════════════════════════════════════════════════

// ── Get App Stats ────────────────────────────────────
export const getAppStats = async () => {
  await delay(300)
  try {
    const donors = await getAllDonors()
    let totalUsers = 0

    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'users'))
      totalUsers = snap.size
    } else {
      const users = getStoredUsers() ?? usersData
      totalUsers = users.length
    }

    const totalDonors = donors.length
    const availableDonors = donors.filter(d => d.availability).length
    const totalDonations = donors.reduce(
      (sum, d) => sum + (d.donationsCount ?? 0), 0
    )

    const bloodGroupStats = donors.reduce((acc, d) => {
      acc[d.bloodGroup] = (acc[d.bloodGroup] ?? 0) + 1
      return acc
    }, {})

    return {
      totalDonors,
      availableDonors,
      totalUsers,
      totalDonations,
      bloodGroupStats,
    }
  } catch (error) {
    throw new Error('Failed to fetch stats.')
  }
}

// ── Reset All Data To Default ────────────────────────
export const resetAllData = async () => {
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
    return { success: true, message: 'All database tables reset and reseeded.' }
  } else {
    setStoredDonors(donorsData)
    setStoredUsers(usersData)
    setItem(STORAGE_KEYS.FAVORITES, [])
    setItem('bc_queries', [])
    return { success: true, message: 'All data reset to default.' }
  }
}