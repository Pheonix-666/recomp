/**
 * ResultBanner — success state shown after processing completes.
 * Props:
 *   resultBlob  {Blob}     — the processed file
 *   fileName    {string}   — download filename
 *   onReset     {function} — called when "Process Another" is clicked
 *   extraInfo   {string}   — optional extra info line (e.g. "Saved 45%")
 */
export default function ResultBanner({ resultBlob, fileName, onReset, extraInfo }) {
  const download = () => {
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="anim-scale-in" style={{
      borderRadius: '20px',
      padding: '40px 32px',
      textAlign: 'center',
      background: 'rgba(34,197,94,0.05)',
      border: '1px solid rgba(34,197,94,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Animated checkmark */}
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: 'rgba(34,197,94,0.1)',
        border: '2px solid rgba(34,197,94,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        animation: 'scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        boxShadow: '0 0 30px rgba(34,197,94,0.2)',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M8 18 L15 25 L28 11"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset="0"
            style={{ animation: 'draw-check 0.5s ease 0.2s both' }}
          />
        </svg>
      </div>

      <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#4ade80', marginBottom: '8px' }}>
        Done!
      </h3>

      {extraInfo && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 16px', borderRadius: '99px', marginBottom: '12px',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
          fontSize: '14px', fontWeight: 700, color: '#4ade80',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>trending_down</span>
          {extraInfo}
        </div>
      )}

      <p style={{ fontSize: '14px', color: 'rgba(34,197,94,0.7)', marginBottom: '28px' }}>
        Your file is ready to download.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={download}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '15px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
          Download File
        </button>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '12px 24px', fontSize: '15px' }}
        >
          Process Another
        </button>
      </div>
    </div>
  );
}
