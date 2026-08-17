import { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function SignTool() {
  const [file, setFile] = useState(null);
  const [sigImage, setSigImage] = useState(null);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);

  const reset = () => { setFile(null); setSigImage(null); setResult(null); clearCanvas(); };
  const clearCanvas = () => {
    const c = canvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setSigImage(null);
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
    ctx.strokeStyle = '#e0e7ff'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y); ctx.stroke();
    lastPos.current = { x, y };
  };
  const endDraw = () => { setDrawing(false); lastPos.current = null; };
  const saveSig = () => setSigImage(canvasRef.current.toDataURL('image/png'));

  const run = async () => {
    if (!sigImage) { alert('Please draw and save your signature first.'); return; }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      const targetPage = pages[Math.min(page - 1, pages.length - 1)];
      const { width } = targetPage.getSize();
      const imgBytes = await fetch(sigImage).then(r => r.arrayBuffer());
      const pngImg = await doc.embedPng(imgBytes);
      const sigW = 180, sigH = 60;
      targetPage.drawImage(pngImg, { x: width - sigW - 36, y: 36, width: sigW, height: sigH });
      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Sign failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`signed_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FileInfoRow f={file} onRemove={reset} />
      <div style={{
        padding: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Draw your signature:</p>
          <button onClick={clearCanvas} style={{
            fontSize: '12px', color: 'var(--error)', background: 'none', border: 'none',
            cursor: 'pointer', fontWeight: 600, padding: '4px 8px', borderRadius: '6px',
          }}>
            Clear
          </button>
        </div>

        <canvas
          ref={canvasRef} width={580} height={130}
          style={{
            width: '100%',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            cursor: 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <label style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Place on Page #
            </span>
            <input
              type="number" min={1} value={page}
              onChange={e => setPage(+e.target.value || 1)}
              className="input-field"
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
            />
          </label>
          <button
            onClick={saveSig}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '14px', whiteSpace: 'nowrap' }}
          >
            ✓ Use Signature
          </button>
        </div>

        {sigImage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Signature saved — ready to embed.
          </div>
        )}
      </div>

      {busy && <ProgressBar progress={70} label="Embedding signature…" />}
      {!busy && (
        <button
          onClick={run}
          disabled={!sigImage}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '15px' }}
        >
          Sign PDF
        </button>
      )}
    </div>
  );
}
