import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

function generationsRef(uid) {
  if (!db) throw new Error('Firestore is not configured')
  return collection(db, 'users', uid, 'generations')
}

/**
 * @param {string} uid
 * @param {(items: object[]) => void} callback
 */
export function subscribeGenerations(uid, callback) {
  if (!isFirebaseConfigured || !db || !uid) {
    callback([])
    return () => {}
  }

  const q = query(generationsRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    },
    () => callback([]),
  )
}

/**
 * @param {string} uid
 * @param {{ prompt: string, style: string, color: string, count: number, variant: number, iconNames: string[] }} data
 */
export async function saveGeneration(uid, data) {
  if (!uid) return null
  return addDoc(generationsRef(uid), {
    prompt: data.prompt,
    style: data.style,
    color: data.color,
    count: data.count,
    variant: data.variant ?? 0,
    iconNames: data.iconNames ?? [],
    nounIds: data.nounIds ?? [],
    source: data.source ?? 'lucide',
    createdAt: serverTimestamp(),
  })
}

export async function deleteGeneration(uid, generationId) {
  if (!uid || !generationId || !db) return
  await deleteDoc(doc(db, 'users', uid, 'generations', generationId))
}

export function formatGenerationDate(createdAt) {
  if (!createdAt) return 'Just now'
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
