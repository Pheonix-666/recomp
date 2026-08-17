/**
 * HowToSection — numbered step list for tool pages.
 * Props:
 *   steps  {Array<{title, desc}>}
 */
export default function HowToSection({ steps }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0',
      position: 'relative',
    }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 24px', position: 'relative' }}>
          {/* Connector line between steps */}
          {i < steps.length - 1 && (
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '60%',
              right: '-10%',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(230,57,70,0.4), rgba(230,57,70,0.1))',
              zIndex: 0,
            }} />
          )}

          {/* Step number circle */}
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-dim), var(--brand))',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 900,
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(230,57,70,0.4)',
            position: 'relative', zIndex: 1,
            flexShrink: 0,
          }}>
            {i + 1}
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', margin: '0 0 8px 0' }}>
            {step.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
