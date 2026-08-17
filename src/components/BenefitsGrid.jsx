/**
 * BenefitsGrid — icon + title + description grid.
 * Props:
 *   benefits  {Array<{icon, title, desc}>}
 */
export default function BenefitsGrid({ benefits }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
    }}>
      {benefits.map((b, i) => (
        <div
          key={i}
          style={{
            padding: '24px 20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            transition: 'all 0.25s ease',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)';
            e.currentTarget.style.background = 'rgba(230,57,70,0.04)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '12px',
            background: 'var(--brand-subtle)',
            border: '1px solid rgba(230,57,70,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--brand)', fontVariationSettings: "'FILL' 1" }}>
              {b.icon}
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', margin: '0 0 6px 0' }}>
              {b.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {b.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
