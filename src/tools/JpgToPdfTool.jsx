import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function JpgToPdfTool() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFiles([]); setResult(null); };

  const loadImage = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        let image;
        if (f.type === 'image/png') {
          image = await doc.embedPng(buf);
        } else if (f.type === 'image/jpeg' || f.type === 'image/jpg') {
          image = await doc.embedJpg(buf);
        } else {
          // Fallback to canvas for other formats (webp, etc)
          const img = await loadImage(f);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          image = await doc.embedPng(pngUrl);
        }
        
        const dims = image.scale(1);
        const page = doc.addPage([dims.width, dims.height]);
        page.drawImage(image, { x: 0, y: 0, width: dims.width, height: dims.height });
      }
      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { alert('Conversion failed: ' + e.message); }
    setBusy(false);
  };

  if (result) return <ResultBanner resultBlob={result} fileName="images.pdf" onReset={reset} />;

  return (
    <div className="space-y-4">
      <DropZone accept="image/*" multi onFiles={fs => setFiles(prev => [...prev, ...fs])} />
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <FileInfoRow key={i} f={f} onRemove={() => setFiles(p => p.filter((_, j) => j !== i))} />
          ))}
          {busy && <ProgressBar progress={66} label="Converting images to PDF…" />}
          {!busy && (
            <button onClick={run} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
              Convert to PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
