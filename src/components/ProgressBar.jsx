/**
 * ProgressBar — animated progress indicator.
 * Props:
 *   progress  {number}   — 0–100
 *   label     {string}   — label text shown above the bar
 */
export default function ProgressBar({ progress, label = 'Processing…' }) {
  return (
    <div className="space-y-2 p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)]">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-[var(--color-primary)]">{label}</span>
        <span className="text-[var(--color-on-surface-variant)]">{progress}%</span>
      </div>
      <div className="w-full bg-[var(--color-outline-variant)] rounded-full h-2 overflow-hidden">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
