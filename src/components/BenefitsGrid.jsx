/**
 * BenefitsGrid — icon + title + description grid.
 * Props:
 *   benefits  {Array<{icon, title, desc}>}
 */
export default function BenefitsGrid({ benefits }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {benefits.map((b, i) => (
        <div key={i} className="flex flex-col gap-2 p-5 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl hover:border-[var(--color-primary)] transition-colors">
          <div className="w-10 h-10 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">{b.icon}</span>
          </div>
          <h3 className="font-semibold text-[var(--color-on-surface)] text-sm">{b.title}</h3>
          <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
