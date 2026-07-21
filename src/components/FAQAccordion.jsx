import { useState } from 'react';

/**
 * FAQAccordion — animated expand/collapse FAQ.
 * Props:
 *   faqs  {Array<{q, a}>}
 */
export default function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-surface-container-low)] transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-[var(--color-on-surface)] text-sm pr-4">{faq.q}</span>
            <span
              className="material-symbols-outlined text-[var(--color-primary)] shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: open === i ? '500px' : '0px' }}
          >
            <div className="px-5 pb-4 pt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline-variant)]">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
