import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'

const POST_AUTH_KEY = 'iconify-post-auth'

const AuthContext = createContext(null)

function googleProvider() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return provider
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return undefined
    }

    getRedirectResult(auth).catch((err) => {
      console.error('Google redirect sign-in failed:', err)
    })

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    signInWithGoogle: async () => {
      if (!auth) throw new Error('Firebase is not configured')

      try {
        sessionStorage.setItem(POST_AUTH_KEY, 'app')
        return await signInWithPopup(auth, googleProvider())
      } catch (err) {
        if (
          err?.code === 'auth/popup-blocked'
          || err?.code === 'auth/popup-closed-by-user'
        ) {
          throw err
        }
        if (
          err?.code === 'auth/operation-not-supported-in-this-environment'
          || err?.code === 'auth/cancelled-popup-request'
        ) {
          await signInWithRedirect(auth, googleProvider())
          return null
        }
        throw err
      }
    },
    signOut: () => {
      if (!auth) return Promise.resolve()
      return firebaseSignOut(auth)
    },
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function consumePostAuthIntent() {
  try {
    const intent = sessionStorage.getItem(POST_AUTH_KEY)
    sessionStorage.removeItem(POST_AUTH_KEY)
    return intent
  } catch {
    return null
  }
}
