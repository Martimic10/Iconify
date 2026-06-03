import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { STATIC_PAGES } from '../content/staticPages'

export default function StaticPage({ slug, onGoHome, onGoToApp, isSignedIn, theme, toggleTheme }) {
  const page = STATIC_PAGES[slug]
  if (!page) return null

  return (
    <div data-theme={theme} style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav
        onGoHome={onGoHome}
        onGoToApp={onGoToApp}
        isSignedIn={isSignedIn}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="static-page">
        <div className="container">
          <header className="static-page-header">
            <h1 className="static-page-title">{page.title}</h1>
            <p className="static-page-updated">Last updated {page.updated}</p>
          </header>

          {page.sections?.map((section) => (
            <section key={section.heading} className="static-page-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}

          {page.releases?.map((release) => (
            <section key={release.version} className="static-page-section">
              <h2>
                v{release.version}
                <span className="static-page-release-date">{release.date}</span>
              </h2>
              <ul className="static-page-list">
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
