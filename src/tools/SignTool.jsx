import { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

const INK_COLORS = [
  { label: 'Navy', value: '#1e3a8a' },
  { label: 'Black', value: '#111827' },
  { label: 'Crimson', value: '#e63946' },
  { label: 'Slate', value: '#475569' },
];

const CURSIVE_FONTS = [
  { name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Classic Script', family: "cursive, 'Brush Script MT', sans-serif" },
];

export default function SignTool() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('draw'); // 'draw' | 'type' | 'upload'
  const [sigImage, setSigImage] = useState(null);
  const [inkColor, setInkColor] = useState('#1e3a8a');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(CURSIVE_FONTS[0].family);
  const [position, setPosition] = useState('bottom-right');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const canvasRef = useRef(null);
  const lastPos = useRef(null);

  const reset = () => {
    setFile(null);
    setSigImage(null);
    setResult(null);
    setTypedName('');
    clearCanvas();
  };

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
    if (mode === 'draw') setSigImage(null);
  };

  const getXY = (e, rect) => ({
    x: (e.touches?.[0]?.clientX ?? e.clientX) - rect.left,
    y: (e.touches?.[0]?.clientY ?? e.clientY) - rect.top,
  });

  const startDraw = (e) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPos.current = getXY(e, rect);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const { x, y } = getXY(e, rect);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
  };

  const endDraw = () => {
    setDrawing(false);
    lastPos.current = null;
    if (canvasRef.current) {
      setSigImage(canvasRef.current.toDataURL('image/png'));
    }
  };

  // Generate signature data URL on demand
  const getSignatureDataUrl = () => {
    if (mode === 'type') {
      if (!typedName.trim()) return null;
      const c = document.createElement('canvas');
      c.width = 600;
      c.height = 150;
      const ctx = c.getContext('2d');
      ctx.fillStyle = inkColor;
      ctx.font = `64px ${selectedFont}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(typedName, 300, 75);
      return c.toDataURL('image/png');
    }
    return sigImage;
  };

  // Handle uploaded signature image
  const handleUploadSignature = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSigImage(event.target.result);
    };
    reader.readAsDataURL(f);
  };

  const run = async () => {
    const signatureData = getSignatureDataUrl();
    if (!signatureData) {
      alert('Please create or upload your signature first.');
      return;
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      const targetPage = pages[Math.min(page - 1, pages.length - 1)];
      const { width, height } = targetPage.getSize();

      const imgBytes = await fetch(signatureData).then(r => r.arrayBuffer());
      let embeddedImg;
      try {
        embeddedImg = await doc.embedPng(imgBytes);
      } catch {
        embeddedImg = await doc.embedJpg(imgBytes);
      }

      const sigW = 180;
      const sigH = 60;
      let posX = width - sigW - 40;
      let posY = 40;

      if (position === 'bottom-left') {
        posX = 40;
        posY = 40;
      } else if (position === 'center') {
        posX = (width - sigW) / 2;
        posY = (height - sigH) / 2;
      } else if (position === 'top-right') {
        posX = width - sigW - 40;
        posY = height - sigH - 40;
      }

      targetPage.drawImage(embeddedImg, {
        x: posX,
        y: posY,
        width: sigW,
        height: sigH,
      });

      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) {
      alert('Sign failed: ' + e.message);
    }
    setBusy(false);
  };

  if (result) {
    return (
      <ResultBanner
        resultBlob={result}
        fileName={`signed_${file.name}`}
        onReset={reset}
        extraInfo={`Signature stamped on page ${page}`}
      />
    );
  }

  if (!file) {
    return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FileInfoRow f={file} onRemove={reset} />

      <div style={{
        padding: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Signature Mode Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          {[
            { id: 'draw', label: 'Draw Signature', icon: 'draw' },
            { id: 'type', label: 'Type Signature', icon: 'text_fields' },
            { id: 'upload', label: 'Upload Image', icon: 'upload_file' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                background: mode === tab.id ? 'var(--brand)' : 'rgba(255,255,255,0.04)',
                color: mode === tab.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${mode === tab.id ? 'var(--brand)' : 'var(--border)'}`,
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ink Colors for Draw/Type */}
        {mode !== 'upload' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Ink Color:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {INK_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setInkColor(c.value)}
                  title={c.label}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: c.value,
                    border: inkColor === c.value ? '2px solid #ffffff' : '2px solid transparent',
                    boxShadow: inkColor === c.value ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* MODE 1: DRAW */}
        {mode === 'draw' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Draw with mouse or finger on the pad below:
              </span>
              <button
                onClick={clearCanvas}
                style={{
                  fontSize: '12px', color: 'var(--error)', background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                Clear Pad
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={580}
              height={140}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                background: '#ffffff',
                cursor: 'crosshair',
                touchAction: 'none',
              }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>
        )}

        {/* MODE 2: TYPE */}
        {mode === 'type' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Type Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {CURSIVE_FONTS.map(f => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFont(f.family)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    background: selectedFont === f.family ? 'rgba(230,57,70,0.1)' : 'rgba(255,255,255,0.04)',
                    color: selectedFont === f.family ? 'var(--brand)' : 'var(--text-primary)',
                    border: `1px solid ${selectedFont === f.family ? 'var(--brand)' : 'var(--border)'}`,
                    fontFamily: f.family, fontSize: '20px', cursor: 'pointer',
                  }}
                >
                  {typedName || f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: UPLOAD */}
        {mode === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '30px', border: '2px dashed var(--border)', borderRadius: '12px',
              cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--brand)', marginBottom: '8px' }}>
                cloud_upload
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Click to upload signature image
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                PNG or JPG with clean or transparent background
              </span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUploadSignature} style={{ display: 'none' }} />
            </label>

            {sigImage && (
              <div style={{ textAlign: 'center', padding: '10px', background: '#fff', borderRadius: '8px' }}>
                <img src={sigImage} alt="Uploaded Signature" style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        )}

        {/* Placement Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Target Page
            </label>
            <input
              type="number"
              min={1}
              value={page}
              onChange={e => setPage(+e.target.value || 1)}
              className="input-field"
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Position on Page
            </label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="center">Center</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
        </div>

        {(mode === 'type' ? typedName.trim() : sigImage) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
            Signature ready to stamp on page {page}.
          </div>
        )}

        {busy && <ProgressBar progress={70} label="Embedding signature on PDF…" />}

        {!busy && (
          <button
            onClick={run}
            disabled={mode === 'type' ? !typedName.trim() : !sigImage}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Sign PDF
          </button>
        )}
      </div>
    </div>
  );
}
