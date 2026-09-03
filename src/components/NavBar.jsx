import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Compress', href: '/pdf-compressor' },
  { label: 'Convert',  href: '/pdf-to-word' },
  { label: 'Edit',     href: '/merge-pdf' },
  { label: 'Security', href: '/protect-pdf' },
  { label: 'Blog',     href: '/blog' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        background: scrolled
          ? 'rgba(8, 13, 26, 0.92)'
          : 'rgba(8, 13, 26, 0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #c1121f, #e63946)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(230,57,70,0.4)',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            PDF <span style={{ color: 'var(--brand)' }}>Precision</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
          {NAV_LINKS.map(l => {
            const active = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  padding: '6px 14px',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: active ? 'var(--brand)' : 'var(--text-secondary)',
                  background: active ? 'var(--brand-subtle)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden md:flex">
          <button style={{
            fontSize: '14px', fontWeight: 500,
            color: 'var(--text-secondary)',
            background: 'none', border: 'none',
            padding: '6px 12px', cursor: 'pointer',
            borderRadius: '8px', transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Log In
          </button>
          <button className="btn-primary" style={{ fontSize: '14px', padding: '8px 20px' }}>
            Get Pro ✦
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            padding: '6px', borderRadius: '8px',
            display: 'flex', alignItems: 'center',
          }}
          className="md:hidden"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(8, 13, 26, 0.97)',
          padding: '16px 24px 20px',
          animation: 'fadeUp 0.2s ease',
        }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              style={{
                display: 'block', padding: '11px 0',
                fontSize: '15px', fontWeight: 500,
                color: location.pathname === l.href ? 'var(--brand)' : 'var(--text-secondary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Log In</button>
            <button className="btn-primary" style={{ flex: 1, padding: '10px' }}>Get Pro ✦</button>
          </div>
        </div>
      )}
    </header>
  );
}
