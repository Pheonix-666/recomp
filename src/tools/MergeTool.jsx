
import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function MergeTool() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const reset = () => { setFiles([]); setResult(null); setProgress(0); };

  const run = async () => {
    if (files.length < 2) { alert('Please add at least 2 PDF files.'); return; }
    setBusy(true); setProgress(5);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const doc = await PDFDocument.load(await files[i].arrayBuffer());
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
        setProgress(5 + Math.round(85 * (i + 1) / files.length));
      }
      const bytes = await merged.save();
      setProgress(100);
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Merge failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName="merged.pdf" onReset={reset} />;

  return (
    <div className="space-y-4">
      <DropZone accept=".pdf" multi onFiles={fs => setFiles(prev => [...prev, ...fs])} />
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">{files.length} file{files.length > 1 ? 's' : ''} selected — will be merged in this order:</p>
          {files.map((f, i) => (
            <FileInfoRow key={i} f={f} onRemove={() => setFiles(prev => prev.filter((_, j) => j !== i))} />
          ))}
          {busy && <ProgressBar progress={progress} label="Merging PDFs…" />}
          {!busy && (
            <button
              onClick={run}
              disabled={files.length < 2}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40"
            >
              Merge {files.length} PDF{files.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
