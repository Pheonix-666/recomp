import { useState, useEffect } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function SplitTool() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); setPageCount(0); };

  useEffect(() => {
    if (!file) return;
    (async () => {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const c = doc.getPageCount();
      setPageCount(c); setFrom(1); setTo(c);
    })();
  }, [file]);

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(await file.arrayBuffer());
      const dst = await PDFDocument.create();
      const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
      const copied = await dst.copyPages(src, indices);
      copied.forEach(p => dst.addPage(p));
      const bytes = await dst.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Split failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`split_p${from}-${to}_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {pageCount > 0 && (
        <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] space-y-4">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            This PDF has <strong className="text-[var(--color-on-surface)]">{pageCount} pages</strong>. Select which pages to extract:
          </p>
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-xs font-semibold mb-1 text-[var(--color-on-surface-variant)]">From Page</span>
              <input type="number" min={1} max={to} value={from}
                onChange={e => setFrom(Math.max(1, Math.min(to, +e.target.value || 1)))}
                className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            </label>
            <label className="flex-1">
              <span className="block text-xs font-semibold mb-1 text-[var(--color-on-surface-variant)]">To Page</span>
              <input type="number" min={from} max={pageCount} value={to}
                onChange={e => setTo(Math.max(from, Math.min(pageCount, +e.target.value || 1)))}
                className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            </label>
          </div>
        </div>
      )}
      {busy && <ProgressBar progress={66} label="Extracting pages…" />}
      {!busy && pageCount > 0 && (
        <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
          Extract Pages {from}–{to}
        </button>
      )}
    </div>
  );
}
