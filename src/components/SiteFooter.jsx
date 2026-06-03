import { X, GitBranch, MessageSquare } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">
              <div className="nav-logo-icon" style={{ width: 24, height: 24, borderRadius: 6, fontSize: 12 }}>◆</div>
              Iconify
            </div>
            <p className="footer-brand-blurb">
              AI-powered custom icon sets for indie makers, startups, and design teams. One-time purchase, lifetime license.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="/#features">Features</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/changelog">Changelog</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/license">License</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Iconify. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" className="footer-social" title="Twitter"><X size={15} /></a>
            <a href="#" className="footer-social" title="GitHub"><GitBranch size={15} /></a>
            <a href="#" className="footer-social" title="Discord"><MessageSquare size={15} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
