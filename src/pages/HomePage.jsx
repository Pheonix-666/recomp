import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../data/tools';
import SEOHead, { buildOrganizationSchema, buildWebSiteSchema } from '../components/SEOHead';

const STATS = [
  { icon: 'picture_as_pdf', value: '10M+', label: 'PDFs Processed' },
  { icon: 'lock', value: '100%', label: 'Browser-Based' },
  { icon: 'bolt', value: '<3s', label: 'Avg. Process Time' },
  { icon: 'devices', value: 'All', label: 'Devices Supported' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.intro?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Free PDF Tools Online – Compress, Convert, Merge & Edit | PDF Precision"
        description="All the PDF tools you need in one place. Compress, merge, edit, and convert PDF files online for free. Secure, fast, and 100% browser-based processing."
        canonical="/"
        schemas={[buildOrganizationSchema(), buildWebSiteSchema()]}
      />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 60px',
        textAlign: 'center',
      }}>
        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-60%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(230,57,70,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'orb-drift 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.25)', fontSize: '13px', fontWeight: 600, color: 'var(--brand)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          100% Free · No Upload · Browser-Based
        </div>

        {/* Heading */}
        <h1 className="anim-fade-up-1" style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '20px' }}>
          <span className="gradient-text">All the PDF tools</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>you'll ever need.</span>
        </h1>

        {/* Sub */}
        <p className="anim-fade-up-2" style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Precision tools for every document workflow. Compress, convert, edit, and secure your PDFs — entirely in your browser.
        </p>

        {/* Search */}
        <div className="anim-fade-up-3" style={{ position: 'relative', maxWidth: '520px', margin: '0 auto 60px' }}>
          <input
            className="search-bar"
            style={{ width: '100%', padding: '16px 52px 16px 52px', fontSize: '15px' }}
            placeholder="Search tools… e.g. 'Compress', 'Merge'"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="tool-search"
          />
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: '22px', pointerEvents: 'none',
          }}>search</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 20px', borderRadius: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(12px)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--brand)', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="gradient-divider" style={{ margin: '0 24px' }} />

      {/* ── Tool Grid ───────────────────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {Object.keys(CATEGORIES).map(category => {
            const catTools = filteredTools.filter(t => t.category === category);
            if (catTools.length === 0) return null;
            const { icon, label } = CATEGORIES[category];
            return (
              <div key={category}>
                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'var(--brand-subtle)',
                    border: '1px solid rgba(230,57,70,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--brand)', fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>{label}</h2>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '8px' }} />
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {catTools.map(tool => (
                    <Link
                      key={tool.id}
                      to={`/${tool.slug}`}
                      className="tool-card"
                      style={{ padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                    >
                      {/* Icon */}
                      <div className="icon-box" style={{
                        width: '48px', height: '48px', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{tool.icon}</span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', margin: '0 0 8px 0' }}>
                        {tool.title}
                      </h3>

                      {/* Description */}
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 auto 0', flexGrow: 1 }}>
                        {(tool.intro || tool.desc || '').slice(0, 72)}…
                      </p>

                      {/* Coming soon badge */}
                      {!tool.implemented && (
                        <span style={{
                          display: 'inline-block', alignSelf: 'flex-start', marginTop: '14px',
                          padding: '3px 10px', borderRadius: '99px',
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
                          background: 'rgba(251,191,36,0.1)', color: '#fbbf24',
                          border: '1px solid rgba(251,191,36,0.25)',
                        }}>
                          Coming Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {filteredTools.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '24px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>search_off</span>
              <p style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '16px' }}>
                No tools found for "{searchQuery}"
              </p>
              <button onClick={() => setSearchQuery('')} style={{
                background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
                color: 'var(--brand)', fontWeight: 600, padding: '8px 20px', borderRadius: '8px',
                fontSize: '14px',
              }}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Pro Banner ──────────────────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: '28px', padding: '56px 48px',
          background: 'linear-gradient(135deg, #0d1425 0%, #141b2d 50%, #0d1425 100%)',
          border: '1px solid rgba(230,57,70,0.2)',
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap',
          boxShadow: '0 0 80px rgba(230,57,70,0.06)',
        }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-40px',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', fontSize: '12px', fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
              Pro Plan
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-1px', lineHeight: 1.1 }}>
              Go Pro.<br /><span className="gradient-text">Get Precision.</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
              Unlock unlimited batch processing, high-fidelity OCR, larger file limits, and priority browser execution.
            </p>
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}>
              Start 7-Day Free Trial →
            </button>
          </div>

          {/* Feature list card */}
          <div style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '24px', minWidth: '220px',
            backdropFilter: 'blur(12px)',
          }}>
            {[
              { icon: 'check_circle', label: 'Unlimited batch processing', color: '#22c55e' },
              { icon: 'check_circle', label: 'Files up to 500 MB', color: '#22c55e' },
              { icon: 'check_circle', label: 'High-fidelity OCR', color: '#22c55e' },
              { icon: 'check_circle', label: 'Priority processing', color: '#22c55e' },
              { icon: 'check_circle', label: 'Ad-free experience', color: '#22c55e' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: f.color, fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
