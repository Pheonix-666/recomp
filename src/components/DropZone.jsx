import { useCallback, useState } from 'react';

/**
 * DropZone — drag-and-drop or click-to-upload file input.
 * Props:
 *   accept    {string}    — file accept string, e.g. ".pdf" or "image/*"
 *   multi     {boolean}   — allow multiple files
 *   onFiles   {function}  — called with File[] when files are chosen
 */
export default function DropZone({ accept = '*', multi = false, onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useCallback(node => { if (node) node.value = ''; }, []);

  const handle = (fileList) => {
    const arr = Array.from(fileList);
    onFiles(multi ? arr : arr.slice(0, 1));
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => document.getElementById('dz-input')?.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--brand)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '20px',
        padding: '52px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging
          ? 'rgba(230,57,70,0.05)'
          : 'rgba(255,255,255,0.02)',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: dragging ? '0 0 0 4px rgba(230,57,70,0.15), inset 0 0 40px rgba(230,57,70,0.04)' : 'none',
        transform: dragging ? 'scale(1.01)' : 'scale(1)',
      }}
      onMouseEnter={e => {
        if (!dragging) {
          e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)';
          e.currentTarget.style.background = 'rgba(230,57,70,0.03)';
        }
      }}
      onMouseLeave={e => {
        if (!dragging) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        }
      }}
    >
      {/* Corner decorations */}
      {[
        { top: 0, left: 0, borderTop: '2px solid var(--brand)', borderLeft: '2px solid var(--brand)', borderRadius: '4px 0 0 0' },
        { top: 0, right: 0, borderTop: '2px solid var(--brand)', borderRight: '2px solid var(--brand)', borderRadius: '0 4px 0 0' },
        { bottom: 0, left: 0, borderBottom: '2px solid var(--brand)', borderLeft: '2px solid var(--brand)', borderRadius: '0 0 0 4px' },
        { bottom: 0, right: 0, borderBottom: '2px solid var(--brand)', borderRight: '2px solid var(--brand)', borderRadius: '0 0 4px 0' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: '16px', height: '16px', opacity: dragging ? 1 : 0, transition: 'opacity 0.2s', ...s }} />
      ))}

      <input
        id="dz-input"
        ref={inputRef}
        type="file"
        multiple={multi}
        accept={accept}
        style={{ display: 'none' }}
        onChange={e => handle(e.target.files)}
      />

      {/* Upload icon */}
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: dragging
          ? 'linear-gradient(135deg, var(--brand-dim), var(--brand))'
          : 'rgba(230,57,70,0.1)',
        border: `2px solid ${dragging ? 'var(--brand)' : 'rgba(230,57,70,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        boxShadow: dragging ? '0 8px 32px rgba(230,57,70,0.4)' : 'none',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: '34px',
          color: dragging ? 'white' : 'var(--brand)',
          transition: 'color 0.3s',
        }}>
          {dragging ? 'download' : 'upload_file'}
        </span>
      </div>

      {/* Text */}
      <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {dragging ? 'Release to upload' : 'Drop your file here'}
      </p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        or <span style={{ color: 'var(--brand)', fontWeight: 600 }}>browse from your device</span>
      </p>

      <div style={{
        display: 'inline-flex', gap: '12px', alignItems: 'center',
        padding: '6px 16px', borderRadius: '99px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
        fontSize: '12px', color: 'var(--text-muted)',
      }}>
        <span>{multi ? 'Multiple files' : 'Single file'}</span>
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        <span>{accept}</span>
      </div>
    </div>
  );
}
