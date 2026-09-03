import { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function WordToPdfTool() {
  const [file, setFile] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [orientation, setOrientation] = useState('portrait');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState(null);
  const previewRef = useRef(null);

  const reset = () => {
    setFile(null);
    setPreviewHtml('');
    setResultBlob(null);
    setProgress(0);
  };

  const handleFiles = async (files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setBusy(true);
    setProgress(25);

    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await f.arrayBuffer();
      setProgress(50);
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setPreviewHtml(result.value || '<p>(Document contains no extractable text content)</p>');
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert('Could not read Word document. Please ensure it is a valid .docx file: ' + err.message);
      reset();
    } finally {
      setBusy(false);
    }
  };

  const convertToPdf = async () => {
    if (!previewRef.current) return;
    setBusy(true);
    setProgress(40);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${file.name.replace(/\.[^/.]+$/, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      setProgress(75);
      const pdfBlob = await html2pdf().from(previewRef.current).set(opt).outputPdf('blob');
      setProgress(100);
      setResultBlob(pdfBlob);
    } catch (err) {
      console.error(err);
      alert('PDF generation failed: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  if (resultBlob) {
    return (
      <ResultBanner
        resultBlob={resultBlob}
        fileName={`${file.name.replace(/\.[^/.]+$/, '')}.pdf`}
        onReset={reset}
        extraInfo="Converted from Microsoft Word (.docx)"
      />
    );
  }

  if (!file) {
    return <DropZone accept=".docx,.doc" onFiles={handleFiles} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FileInfoRow f={file} onRemove={reset} />

      {/* Controls */}
      <div style={{
        padding: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Page Orientation
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  background: orientation === 'portrait' ? 'var(--brand)' : 'rgba(255,255,255,0.05)',
                  color: orientation === 'portrait' ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${orientation === 'portrait' ? 'var(--brand)' : 'var(--border)'}`,
                }}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  background: orientation === 'landscape' ? 'var(--brand)' : 'rgba(255,255,255,0.05)',
                  color: orientation === 'landscape' ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${orientation === 'landscape' ? 'var(--brand)' : 'var(--border)'}`,
                }}
              >
                Landscape
              </button>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            A4 Standard • 100% In-Browser Rendering
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Document Content Preview
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Scroll to preview full document
            </span>
          </div>

          <div
            style={{
              maxHeight: '340px',
              overflowY: 'auto',
              background: '#ffffff',
              color: '#1e293b',
              padding: '24px 32px',
              borderRadius: '12px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            <div
              ref={previewRef}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{
                background: '#fff',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {busy && (
          <ProgressBar progress={progress} label="Generating High-Fidelity PDF…" />
        )}

        {!busy && (
          <button
            onClick={convertToPdf}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Convert to PDF
          </button>
        )}
      </div>
    </div>
  );
}
