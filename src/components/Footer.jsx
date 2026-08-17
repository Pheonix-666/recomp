import { Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';

const FOOTER_TOOLS = TOOLS.slice(0, 12);

export default function Footer() {
  return (
    <footer style={{
      background: '#06090f',
      borderTop: '1px solid var(--border)',
      padding: '60px 24px 32px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: '34px', height: '34px',
                background: 'linear-gradient(135deg, #c1121f, #e63946)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(230,57,70,0.3)',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
              </div>
              <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                PDF <span style={{ color: 'var(--brand)' }}>Precision</span>
              </span>
            </Link>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '200px' }}>
              Free online PDF tools. Compress, convert, edit, and secure your PDFs — entirely in your browser.
            </p>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
              {['lock', 'bolt', 'devices'].map((icon, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '99px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  fontSize: '11px', color: 'var(--text-muted)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: 'var(--success)' }}>{icon}</span>
                  {['Secure', 'Fast', 'Private'][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              Popular Tools
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FOOTER_TOOLS.slice(0, 6).map(t => (
                <li key={t.id}>
                  <Link to={`/${t.slug}`} style={{
                    fontSize: '13px', color: 'var(--text-muted)',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              More Tools
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FOOTER_TOOLS.slice(6, 12).map(t => (
                <li key={t.id}>
                  <Link to={`/${t.slug}`} style={{
                    fontSize: '13px', color: 'var(--text-muted)',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              Company
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} style={{
                    fontSize: '13px', color: 'var(--text-muted)',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PDF Precision. All rights reserved. Files are processed locally in your browser.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {['language', 'help_outline'].map(icon => (
              <span key={icon} className="material-symbols-outlined" style={{
                fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
