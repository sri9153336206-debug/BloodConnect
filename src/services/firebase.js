import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import donorsData from '../data/donors.json'
import usersData from '../data/users.json'

const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

let app = null
let db = null
let auth = null
let isFirebaseEnabled = false

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    isFirebaseEnabled = true
    console.log('[Firebase] Successfully initialized Firestore database and Auth.')
  } catch (error) {
    console.error('[Firebase] Initialization error:', error)
  }
} else {
  console.warn(
    '[Firebase] "VITE_FIREBASE_PROJECT_ID" not found in environment variables. ' +
    'Falling back to simulated localStorage database.'
  )
}

// ── Seeding Helper ─────────────────────────────────────────────────────────
export const seedDatabaseIfEmpty = async () => {
  if (!isFirebaseEnabled || !db) return

  try {
    // 1. Seed Donors
    const donorsRef  = collection(db, 'donors')
    const donorsSnap = await getDocs(donorsRef)
    if (donorsSnap.empty) {
      console.log('[Firebase] Seeding empty donors collection...')
      for (const donor of donorsData) {
        await setDoc(doc(db, 'donors', donor.id), donor)
      }
      console.log('[Firebase] Seeding donors completed.')
    }

    // 2. Seed Users
    const usersRef  = collection(db, 'users')
    const usersSnap = await getDocs(usersRef)
    if (usersSnap.empty) {
      console.log('[Firebase] Seeding empty users collection...')
      for (const user of usersData) {
        await setDoc(doc(db, 'users', user.id), user)
      }
      console.log('[Firebase] Seeding users completed.')
    }
  } catch (error) {
    console.error('[Firebase] Seeding failed:', error)
  }
}

export { db, auth, isFirebaseEnabled, GoogleAuthProvider, signInWithPopup }
