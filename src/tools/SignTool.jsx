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
    ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-on-surface)]">Draw your signature:</p>
          <button onClick={clearCanvas} className="text-xs text-[var(--color-error)] hover:underline font-medium">Clear</button>
        </div>
        <canvas
          ref={canvasRef} width={580} height={130}
          className="w-full border border-[var(--color-outline-variant)] rounded-xl bg-white cursor-crosshair touch-none"
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        <div className="flex gap-3 items-end">
          <label className="flex-1">
            <span className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Place on Page #</span>
            <input type="number" min={1} value={page} onChange={e => setPage(+e.target.value || 1)}
              className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          </label>
          <button onClick={saveSig}
            className="px-4 py-2 bg-white border border-[var(--color-outline-variant)] rounded-lg text-sm font-semibold hover:bg-[var(--color-surface-container-high)] transition-colors">
            ✓ Use Signature
          </button>
        </div>
        {sigImage && (
          <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
            <span className="material-symbols-outlined text-lg text-green-600">check_circle</span>Signature saved — ready to embed.
          </div>
        )}
      </div>
      {busy && <ProgressBar progress={70} label="Embedding signature…" />}
      {!busy && (
        <button onClick={run} disabled={!sigImage}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40">
          Sign PDF
        </button>
      )}
    </div>
  );
}
