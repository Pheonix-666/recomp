import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';
import { formatSize } from '../utils';

export default function CompressTool() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const reset = () => { setFile(null); setResult(null); setProgress(0); };

  const run = async () => {
    setBusy(true); setProgress(20);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      setProgress(60);
      const bytes = await doc.save({ useObjectStreams: true });
      setProgress(100);
      setResult({ blob: new Blob([bytes], { type: 'application/pdf' }), originalSize: file.size, newSize: bytes.byteLength });
    } catch (e) { alert('Compression failed: ' + e.message); }
    setBusy(false);
  };

  if (result) {
    const saved = result.originalSize - result.newSize;
    const pct   = Math.round((saved / result.originalSize) * 100);
    return (
      <ResultBanner
        resultBlob={result.blob}
        fileName={`compressed_${file.name}`}
        onReset={reset}
        extraInfo={`${formatSize(result.originalSize)} → ${formatSize(result.newSize)} (saved ${pct}%)`}
      />
    );
  }

  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FileInfoRow f={file} onRemove={reset} />
      {busy && <ProgressBar progress={progress} label="Compressing PDF…" />}
      {!busy && (
        <button onClick={run} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          Compress PDF
        </button>
      )}
    </div>
  );
}
