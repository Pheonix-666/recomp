/**
 * ProgressBar — animated gradient progress indicator.
 * Props:
 *   progress  {number}   — 0–100
 *   label     {string}   — label text shown above the bar
 */
export default function ProgressBar({ progress, label = 'Processing…' }) {
  return (
    <div style={{
      padding: '20px 24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--brand)',
            animation: 'pulse-ring 1.5s ease infinite',
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        </div>
        <span style={{
          fontSize: '13px', fontWeight: 700,
          color: 'var(--brand)',
          background: 'var(--brand-subtle)',
          padding: '2px 10px', borderRadius: '99px',
        }}>
          {progress}%
        </span>
      </div>

      {/* Track */}
      <div style={{
        width: '100%', height: '6px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '99px',
        overflow: 'hidden',
      }}>
        {/* Fill */}
        <div style={{
          height: '100%',
          width: `${progress}%`,
          borderRadius: '99px',
          background: 'linear-gradient(90deg, var(--brand-dim), var(--brand), #ff8c42)',
          backgroundSize: '200px 100%',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'bar-shimmer 1.5s linear infinite',
          position: 'relative',
        }}>
          {/* Shimmer overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200px 100%',
            animation: 'bar-shimmer 1.5s linear infinite',
          }} />
        </div>
      </div>
    </div>
  );
}
