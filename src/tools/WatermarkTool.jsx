import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function WatermarkTool() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.35);
  const [fontSize, setFontSize] = useState(48);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); };

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: (height - fontSize) / 2,
          size: fontSize,
          font,
          color: rgb(0.85, 0.1, 0.1),
          rotate: degrees(45),
          opacity,
        });
      });
      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Watermark failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`watermarked_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Watermark Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={40}
            className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        </div>
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Opacity: {Math.round(opacity * 100)}%</span>
            <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(+e.target.value)}
              className="w-full accent-[var(--color-primary)]" />
          </label>
          <label className="flex-1">
            <span className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Size: {fontSize}pt</span>
            <input type="range" min="16" max="96" step="4" value={fontSize} onChange={e => setFontSize(+e.target.value)}
              className="w-full accent-[var(--color-primary)]" />
          </label>
        </div>
        {/* Live preview */}
        <div className="h-16 bg-white rounded-lg border border-dashed border-[var(--color-outline-variant)] flex items-center justify-center overflow-hidden">
          <span style={{ fontSize: `${Math.min(fontSize * 0.6, 32)}px`, opacity, color: '#d91a1a', transform: 'rotate(45deg)', fontWeight: 700, letterSpacing: 2, whiteSpace: 'nowrap' }}>
            {text}
          </span>
        </div>
      </div>
      {busy && <ProgressBar progress={70} label="Adding watermark…" />}
      {!busy && (
        <button onClick={run} disabled={!text.trim()}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40">
          Add Watermark
        </button>
      )}
    </div>
  );
}
