import { useState, useEffect } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function DeletePagesTool() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); setPageCount(0); setInput(''); };

  useEffect(() => {
    if (!file) return;
    (async () => {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      setPageCount(doc.getPageCount());
    })();
  }, [file]);

  const parsePages = () => {
    const set = new Set();
    for (const part of input.split(',')) {
      const [a, b] = part.trim().split('-').map(n => parseInt(n));
      if (!isNaN(b)) for (let i = a; i <= b; i++) set.add(i);
      else if (!isNaN(a)) set.add(a);
    }
    return set;
  };

  const run = async () => {
    setBusy(true);
    try {
      const toDelete = parsePages();
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(await file.arrayBuffer());
      const dst = await PDFDocument.create();
      const keep = Array.from({ length: pageCount }, (_, i) => i).filter(i => !toDelete.has(i + 1));
      if (keep.length === 0) { alert('You cannot delete all pages.'); setBusy(false); return; }
      const pages = await dst.copyPages(src, keep);
      pages.forEach(p => dst.addPage(p));
      const bytes = await dst.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Error: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`edited_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {pageCount > 0 && (
        <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] space-y-3">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            PDF has <strong className="text-[var(--color-on-surface)]">{pageCount} pages</strong>. Enter pages to delete:
          </p>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 2, 4-6, 9"
            className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Comma-separated page numbers or ranges. E.g. <code className="bg-[var(--color-outline-variant)]/30 px-1 rounded">2, 4-6, 9</code>
          </p>
        </div>
      )}
      {busy && <ProgressBar progress={60} label="Removing pages…" />}
      {!busy && pageCount > 0 && (
        <button onClick={run} disabled={!input.trim()}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40">
          Delete Pages
        </button>
      )}
    </div>
  );
}
