import { formatSize } from '../utils';

/**
 * FileInfoRow — displays a file name + size with an optional remove button.
 * Props:
 *   f        {File}      — file object
 *   onRemove {function}  — called when remove button clicked; omit to hide button
 */
export default function FileInfoRow({ f, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      gap: '12px',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
        {/* PDF icon */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'var(--brand-subtle)',
          border: '1px solid rgba(230,57,70,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--brand)', fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
        </div>

        <div style={{ overflow: 'hidden', flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {f.name}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {formatSize(f.size)}
          </p>
        </div>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove file"
          style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.15)',
            borderRadius: '8px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.2s ease',
            color: 'var(--error)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      )}
    </div>
  );
}
