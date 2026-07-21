import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function HtmlToPdfTool() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); };

  const run = async () => {
    setBusy(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const text = await file.text();
      const el = document.createElement('div');
      el.innerHTML = text;
      el.style.cssText = 'position:absolute;left:-9999px;top:0;width:794px;';
      document.body.appendChild(el);
      const blob = await html2pdf().from(el).output('blob');
      document.body.removeChild(el);
      setResult(blob);
    } catch (e) { alert('Conversion failed: ' + e.message); }
    setBusy(false);
  };

  const baseName = file?.name.replace(/\.html?$/i, '') ?? 'output';
  if (result) return <ResultBanner resultBlob={result} fileName={`${baseName}.pdf`} onReset={reset} />;
  if (!file) return <DropZone accept=".html,.htm" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {busy && <ProgressBar progress={60} label="Rendering HTML to PDF…" />}
      {!busy && (
        <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
          Convert to PDF
        </button>
      )}
    </div>
  );
}
