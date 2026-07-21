import { useState, useEffect, useRef } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function RearrangeTool() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const reset = () => { setFile(null); setPages([]); setResult(null); };

  useEffect(() => {
    if (!file) return;
    (async () => {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      setPages(Array.from({ length: doc.getPageCount() }, (_, i) => ({ index: i, label: `Page ${i + 1}` })));
    })();
  }, [file]);

  const onDragEnd = () => {
    const arr = [...pages];
    const [moved] = arr.splice(dragItem.current, 1);
    arr.splice(dragOver.current, 0, moved);
    setPages(arr);
    dragItem.current = null;
    dragOver.current = null;
  };

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(await file.arrayBuffer());
      const dst = await PDFDocument.create();
      const copied = await dst.copyPages(src, pages.map(p => p.index));
      copied.forEach(p => dst.addPage(p));
      const bytes = await dst.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Error: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`reordered_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {pages.length > 0 && (
        <>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Drag pages to reorder them ({pages.length} total):
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {pages.map((p, i) => (
              <div
                key={`${p.index}-${i}`}
                draggable
                onDragStart={() => { dragItem.current = i; }}
                onDragEnter={() => { dragOver.current = i; }}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className="flex items-center gap-3 p-3 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl cursor-grab active:cursor-grabbing hover:border-[var(--color-primary)] transition-colors select-none"
              >
                <span className="material-symbols-outlined text-[var(--color-outline)] text-xl">drag_indicator</span>
                <span className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">{i + 1}</span>
                <span className="text-sm font-medium text-[var(--color-on-surface)]">{p.label}</span>
                <span className="text-xs text-[var(--color-on-surface-variant)] ml-auto opacity-60">orig. pg {p.index + 1}</span>
              </div>
            ))}
          </div>
          {busy && <ProgressBar progress={70} label="Saving reordered PDF…" />}
          {!busy && (
            <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
              Save Reordered PDF
            </button>
          )}
        </>
      )}
    </div>
  );
}
