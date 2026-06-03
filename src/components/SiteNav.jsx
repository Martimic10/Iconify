import { useState, useEffect } from 'react'
import { X, Menu, Sun, Moon } from 'lucide-react'

export default function SiteNav({ onGoToApp, onGoHome, isSignedIn, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleLogoClick = () => {
    onGoHome?.()
    closeMenu()
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={handleLogoClick}>
            <div className="nav-logo-icon">◆</div>
            Iconify
          </div>
          <ul className="nav-links">
            <li><a href="/#features">Features</a></li>
            <li><a href="/#how-it-works">How it works</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button className="btn-primary nav-cta-btn" onClick={onGoToApp} style={{ fontSize: 13, padding: '10px 20px' }}>
              {isSignedIn ? 'Open Studio →' : 'Sign in with Google →'}
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="nav-mobile-menu">
          <a href="/#features" onClick={closeMenu}>Features</a>
          <a href="/#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="/#pricing" onClick={closeMenu}>Pricing</a>
          <a href="/#faq" onClick={closeMenu}>FAQ</a>
          <button className="nav-mobile-cta" onClick={() => { onGoToApp(); closeMenu() }}>
            {isSignedIn ? 'Open Studio →' : 'Sign in with Google →'}
          </button>
        </div>
      )}
    </>
  )
}
