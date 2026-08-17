import { useState } from 'react';

/**
 * FAQAccordion — animated expand/collapse FAQ.
 * Props:
 *   faqs  {Array<{q, a}>}
 */
export default function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${isOpen ? 'rgba(230,57,70,0.3)' : 'var(--border)'}`,
              borderRadius: '14px',
              overflow: 'hidden',
              background: isOpen ? 'rgba(230,57,70,0.03)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.25s ease',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px',
                textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5, flex: 1, transition: 'color 0.2s' }}>
                {faq.q}
              </span>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: isOpen ? 'var(--brand-subtle)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isOpen ? 'rgba(230,57,70,0.3)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: isOpen ? 'var(--brand)' : 'var(--text-muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease, color 0.2s ease',
                  }}
                >
                  expand_more
                </span>
              </div>
            </button>

            <div style={{
              maxHeight: isOpen ? '400px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                padding: '0 20px 18px',
                borderTop: '1px solid var(--border)',
                paddingTop: '16px',
              }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
