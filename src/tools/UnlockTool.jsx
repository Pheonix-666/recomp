import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function UnlockTool() {
  const [file, setFile] = useState(null);
  const [pw, setPw] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); setPw(''); };

  const run = async () => {
    if (!pw) { alert('Please enter the document password.'); return; }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer(), { password: pw });
      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Unlock failed. Make sure the password is correct.\n' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`unlocked_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)]">
        <label className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Document Password</label>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter the current password"
          className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">You must know the existing password to remove protection.</p>
      </div>
      {busy && <ProgressBar progress={70} label="Removing protection…" />}
      {!busy && (
        <button onClick={run} disabled={!pw}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40">
          Unlock PDF
        </button>
      )}
    </div>
  );
}
