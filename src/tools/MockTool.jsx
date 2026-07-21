import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';

export default function MockTool({ tool }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => { setFile(null); setProgress(0); setDone(false); };

  const run = () => {
    setBusy(true); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { setDone(true); setBusy(false); }, 400); }
      setProgress(Math.round(p));
    }, 250);
  };

  if (done) return (
    <div className="text-center py-10 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-3xl">schedule</span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-[var(--color-on-surface)]">Feature Coming Soon</h3>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm mx-auto">
        This tool ({tool.title}) requires a server-side API to process complex file formats. We are actively working on integrating it!
      </p>
      <button onClick={reset} className="mt-6 px-6 py-2 border border-[var(--color-outline-variant)] rounded-xl text-sm font-semibold hover:bg-[var(--color-surface-container-high)] transition-colors">
        Try Another File
      </button>
    </div>
  );

  if (!file) return <DropZone accept={tool.accept} multi={tool.multi} onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      {busy && <ProgressBar progress={progress} label={`Processing with ${tool.title}…`} />}
      {!busy && !done && (
        <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
          {tool.title}
        </button>
      )}
    </div>
  );
}
