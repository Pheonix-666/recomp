/**
 * HowToSection — numbered step list for tool pages.
 * Props:
 *   steps  {Array<{title, desc}>}
 */
export default function HowToSection({ steps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-bold shrink-0">
            {i + 1}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-on-surface)] mb-1">{step.title}</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
