import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function RotateTool() {
  const [file, setFile] = useState(null);
  const [degrees, setDegrees] = useState(90);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); };

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument, degrees: pdfDeg } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach(p => {
        const cur = p.getRotation().angle;
        p.setRotation(pdfDeg((cur + degrees) % 360));
      });
      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Rotation failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`rotated_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)]">
        <p className="text-xs font-semibold mb-3 text-[var(--color-on-surface-variant)]">Choose Rotation</p>
        <div className="flex gap-3">
          {[['↻ 90° Right', 90], ['↓ 180°', 180], ['↺ 90° Left', 270]].map(([label, val]) => (
            <button key={val} onClick={() => setDegrees(val)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                degrees === val
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {busy && <ProgressBar progress={70} label="Rotating pages…" />}
      {!busy && (
        <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
          Rotate PDF
        </button>
      )}
    </div>
  );
}
