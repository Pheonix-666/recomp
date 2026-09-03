import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'hin', name: 'Hindi' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'jpn', name: 'Japanese' },
];

export default function OcrTool() {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState('eng');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [pagesText, setPagesText] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const reset = () => {
    setFile(null);
    setPagesText([]);
    setProgress(0);
    setStatusMsg('');
    setActivePage(0);
  };

  const runOcr = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(5);
    setStatusMsg('Initializing OCR Engine…');

    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const extractedPages = [];

        // Try digital extraction first
        let hasDigitalText = false;
        const digitalResults = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const pg = await pdf.getPage(i);
          const content = await pg.getTextContent();
          const pageStr = content.items.map(it => it.str).join(' ').trim();
          if (pageStr.length > 30) {
            hasDigitalText = true;
          }
          digitalResults.push({ pageNum: i, text: pageStr });
        }

        // If high quality digital text exists, use it
        if (hasDigitalText) {
          setProgress(100);
          setStatusMsg('Digital text extracted successfully!');
          setPagesText(digitalResults);
          setBusy(false);
          return;
        }

        // Otherwise run Tesseract OCR on rendered canvas for each page
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker(lang);

        for (let i = 1; i <= pdf.numPages; i++) {
          setStatusMsg(`Recognizing text in Page ${i} of ${pdf.numPages}…`);
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width;
          canvas.height = vp.height;
          await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

          const { data: { text } } = await worker.recognize(canvas);
          extractedPages.push({ pageNum: i, text: text || '(No readable text detected on this page)' });
          setProgress(Math.round((i / pdf.numPages) * 100));
        }

        await worker.terminate();
        setPagesText(extractedPages);
      } else {
        // Image file (JPG, PNG, WebP, etc.)
        setStatusMsg('Loading OCR worker…');
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker(lang);
        setProgress(30);

        setStatusMsg('Analyzing and recognizing text…');
        const { data: { text } } = await worker.recognize(file);
        setProgress(100);
        await worker.terminate();

        setPagesText([{ pageNum: 1, text: text || '(No text detected in image)' }]);
      }
    } catch (err) {
      console.error(err);
      alert('OCR failed: ' + (err.message || 'Unknown error occurred.'));
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async () => {
    const fullText = pagesText.map(p => `--- Page ${p.pageNum} ---\n${p.text}`).join('\n\n');
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadTxt = () => {
    const fullText = pagesText.map(p => `--- Page ${p.pageNum} ---\n${p.text}`).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_ocr.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalWords = pagesText.reduce((acc, p) => acc + (p.text.trim().split(/\s+/).filter(Boolean).length), 0);
  const totalChars = pagesText.reduce((acc, p) => acc + p.text.length, 0);

  if (pagesText.length > 0) {
    const currentText = pagesText[activePage]?.text || '';
    const displayedText = searchQuery
      ? currentText.split(new RegExp(`(${searchQuery})`, 'gi'))
      : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Success header */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>check_circle</span>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                OCR Complete
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {pagesText.length} page{pagesText.length > 1 ? 's' : ''} • {totalWords} words • {totalChars} characters
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={copyToClipboard}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: copied ? 'var(--success)' : 'rgba(255,255,255,0.06)',
                color: copied ? '#fff' : 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {copied ? 'done' : 'content_copy'}
              </span>
              {copied ? 'Copied!' : 'Copy All'}
            </button>

            <button
              onClick={downloadTxt}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: 'var(--brand)', color: '#fff',
                border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 2px 10px var(--brand-glow)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              Download .TXT
            </button>
          </div>
        </div>

        {/* Page navigation if multi-page */}
        {pagesText.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {pagesText.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePage(idx)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: activePage === idx ? 'var(--brand)' : 'rgba(255,255,255,0.05)',
                  color: activePage === idx ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${activePage === idx ? 'var(--brand)' : 'var(--border)'}`,
                }}
              >
                Page {p.pageNum}
              </button>
            ))}
          </div>
        )}

        {/* Search bar inside text */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search within extracted text…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 16px 10px 40px',
              borderRadius: '10px', border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)',
              fontSize: '13px', boxSizing: 'border-box',
            }}
          />
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: '20px', pointerEvents: 'none',
          }}>
            search
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
        </div>

        {/* Text content area */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.7',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}>
          {displayedText ? (
            displayedText.map((chunk, i) =>
              chunk.toLowerCase() === searchQuery.toLowerCase() ? (
                <mark key={i} style={{ background: '#f59e0b', color: '#000', borderRadius: '2px', padding: '0 2px' }}>
                  {chunk}
                </mark>
              ) : (
                chunk
              )
            )
          ) : (
            currentText
          )}
        </div>

        {/* Reset button */}
        <button
          onClick={reset}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            border: '1px solid var(--border)', background: 'none',
            color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          OCR Another Document
        </button>
      </div>
    );
  }

  if (!file) {
    return (
      <DropZone
        accept=".pdf,image/*,.png,.jpg,.jpeg,.webp,.tiff,.bmp"
        onFiles={fs => setFile(fs[0])}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FileInfoRow f={file} onRemove={reset} />

      <div style={{
        padding: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Document Language
          </label>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            disabled={busy}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', fontSize: '14px', cursor: 'pointer',
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: 'var(--bg-elevated)', color: '#fff' }}>
                {l.name}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
            Selecting the document's language ensures maximum OCR character recognition accuracy.
          </span>
        </div>

        {busy && (
          <ProgressBar progress={progress} label={statusMsg} />
        )}

        {!busy && (
          <button
            onClick={runOcr}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Extract & OCR Text
          </button>
        )}
      </div>
    </div>
  );
}
