import { useEffect, useState } from 'react'
import { AuthProvider, useAuth, consumePostAuthIntent } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import Landing from './pages/Landing'
import AppPage from './pages/AppPage'
import StaticPage from './pages/StaticPage'
import { getStaticPageFromPath, STATIC_PAGE_PATHS } from './content/staticPages'
import { Loader2 } from 'lucide-react'

function getInitialPage() {
  const staticSlug = getStaticPageFromPath(window.location.pathname)
  if (staticSlug) return staticSlug

  const params = new URLSearchParams(window.location.search)
  if (params.get('session_id') || params.get('checkout')) return 'app'
  if (consumePostAuthIntent() === 'app') return 'app'
  return 'landing'
}

function AppShell() {
  const { user, loading, signOut } = useAuth()
  const [page, setPage] = useState(getInitialPage)
  const [showAuth, setShowAuth] = useState(false)
  const [theme, setTheme] = useState('dark')

  const goToStudio = () => {
    if (user) setPage('app')
    else setShowAuth(true)
  }

  const goToHome = () => {
    window.history.pushState({}, '', '/')
    setPage('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeAuth = () => {
    setShowAuth(false)
    if (page === 'app' && !user) setPage('landing')
  }

  useEffect(() => {
    const onPopState = () => {
      const staticSlug = getStaticPageFromPath(window.location.pathname)
      if (staticSlug) {
        setPage(staticSlug)
        return
      }
      if (window.location.pathname === '/') {
        setPage('landing')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!loading && page === 'app' && !user) {
      setShowAuth(true)
    }
  }, [loading, page, user])

  useEffect(() => {
    if (user && showAuth) {
      setShowAuth(false)
      setPage('app')
    }
  }, [user, showAuth])

  if (loading) {
    return (
      <div className="auth-loading">
        <Loader2 size={28} className="app-spin" />
      </div>
    )
  }

  const staticProps = {
    onGoHome: goToHome,
    onGoToApp: goToStudio,
    isSignedIn: Boolean(user),
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  }

  return (
    <>
      {page === 'app' && user ? (
        <AppPage
          onGoBack={() => setPage('landing')}
          onSignOut={() => signOut().then(() => setPage('landing'))}
        />
      ) : STATIC_PAGE_PATHS[page] ? (
        <StaticPage slug={page} {...staticProps} />
      ) : (
        <Landing {...staticProps} />
      )}

      {showAuth && !user && (
        <AuthModal
          onClose={closeAuth}
          onSuccess={() => {
            setShowAuth(false)
            setPage('app')
          }}
        />
      )}
    </>
  )
}

export default function Iconify() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
