import { Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';

const FOOTER_TOOLS = TOOLS.slice(0, 12);

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/logo.svg" alt="PDF Precision" className="w-8 h-8" />
              <span className="text-lg font-bold text-[var(--color-primary)]">PDF Precision</span>
            </Link>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              Free online PDF tools. Compress, convert, edit, and secure your PDFs — entirely in your browser.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-3 uppercase tracking-wider">Popular Tools</h3>
            <ul className="space-y-2">
              {FOOTER_TOOLS.slice(0, 6).map(t => (
                <li key={t.id}>
                  <Link to={`/${t.slug}`} className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-3 uppercase tracking-wider">More Tools</h3>
            <ul className="space-y-2">
              {FOOTER_TOOLS.slice(6, 12).map(t => (
                <li key={t.id}>
                  <Link to={`/${t.slug}`} className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-3 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-outline-variant)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            © {new Date().getFullYear()} PDF Precision. All rights reserved. Files are processed locally in your browser.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] cursor-pointer hover:text-[var(--color-primary)] transition-colors">language</span>
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] cursor-pointer hover:text-[var(--color-primary)] transition-colors">help</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
