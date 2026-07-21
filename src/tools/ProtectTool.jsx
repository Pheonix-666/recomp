import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function ProtectTool() {
  const [file, setFile] = useState(null);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setResult(null); setPw(''); setPw2(''); };

  const run = async () => {
    if (!pw) { alert('Please enter a password.'); return; }
    if (pw !== pw2) { alert('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const bytes = await doc.save({ userPassword: pw, ownerPassword: pw });
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Protection failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName={`protected_${file.name}`} onReset={reset} />;
  if (!file) return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;

  return (
    <div className="space-y-4">
      <FileInfoRow f={file} onRemove={reset} />
      <div className="p-5 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Set Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter a strong password"
            className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]">Confirm Password</label>
          <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Repeat password"
            className="w-full border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      {busy && <ProgressBar progress={70} label="Encrypting PDF…" />}
      {!busy && (
        <button onClick={run} disabled={!pw}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-40">
          Protect PDF
        </button>
      )}
    </div>
  );
}
