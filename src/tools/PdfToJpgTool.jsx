import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

export default function PdfToJpgTool() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pages, setPages] = useState([]);

  const reset = () => { setFile(null); setPages([]); };

  const run = async () => {
    setBusy(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const results = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i);
        const vp = pg.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
        results.push({ blob, label: `page_${i}.jpg`, url: URL.createObjectURL(blob) });
      }
      setPages(results);
    } catch (e) { alert('Conversion failed: ' + e.message); }
    setBusy(false);
  };

  const download = (p) => {
    const a = document.createElement('a'); a.href = p.url; a.download = p.label;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (pages.length > 0) return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-on-surface-variant)]">{pages.length} page{pages.length > 1 ? 's' : ''} converted. Click any image to download:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pages.map((p, i) => (
          <button key={i} onClick={() => download(p)}
            className="border border-[var(--color-outline-variant)] rounded-xl overflow-hidden hover:border-[var(--color-primary)] hover:shadow-md transition-all group">
            <img src={p.url} alt={p.label} className="w-full aspect-[3/4] object-cover" loading="lazy" />
            <div className="p-2 text-xs font-medium text-center text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">download</span>{p.label}
            </div>
          </button>
        ))}
      </div>
      <button onClick={reset} className="w-full py-2 rounded-xl border border-[var(--color-outline-variant)] text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
        Process Another
      </button>
    </div>
  );

  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {busy && <ProgressBar progress={50} label="Rendering PDF pages…" />}
      {!busy && (
        <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
          Convert to JPG
        </button>
      )}
    </div>
  );
}
