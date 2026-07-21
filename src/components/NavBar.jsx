import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Compress', href: '/pdf-compressor' },
  { label: 'Convert',  href: '/pdf-to-word' },
  { label: 'Edit',     href: '/merge-pdf' },
  { label: 'Security', href: '/protect-pdf' },
  { label: 'Blog',     href: '/blog' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white border-b border-[var(--color-outline-variant)] shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="PDF Precision logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">PDF Precision</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] px-3 py-1.5 transition-colors">
            Log In
          </button>
          <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
            Get Pro
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[var(--color-on-surface-variant)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-outline-variant)] bg-white px-6 py-4 space-y-3">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[var(--color-outline-variant)] flex gap-3">
            <button className="flex-1 py-2 text-sm border border-[var(--color-outline-variant)] rounded-lg font-medium">Log In</button>
            <button className="flex-1 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg font-semibold">Get Pro</button>
          </div>
        </div>
      )}
    </header>
  );
}
