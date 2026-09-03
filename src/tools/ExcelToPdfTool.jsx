import { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function ExcelToPdfTool() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [orientation, setOrientation] = useState('landscape');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState(null);
  const previewRef = useRef(null);

  const reset = () => {
    setFile(null);
    setSheets([]);
    setResultBlob(null);
    setProgress(0);
    setActiveSheetIdx(0);
  };

  const handleFiles = async (files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setBusy(true);
    setProgress(30);

    try {
      const XLSX = await import('xlsx');
      const buf = await f.arrayBuffer();
      setProgress(60);
      const workbook = XLSX.read(buf, { type: 'array' });

      const parsedSheets = workbook.SheetNames.map(name => {
        const ws = workbook.Sheets[name];
        const html = XLSX.utils.sheet_to_html(ws, { id: `sheet-${name}`, editable: false });
        return { name, html };
      });

      setSheets(parsedSheets);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert('Could not read spreadsheet file: ' + err.message);
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
        margin: [10, 10, 10, 10],
        filename: `${file.name.replace(/\.[^/.]+$/, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      setProgress(75);
      const pdfBlob = await html2pdf().from(previewRef.current).set(opt).outputPdf('blob');
      setProgress(100);
      setResultBlob(pdfBlob);
    } catch (err) {
      console.error(err);
      alert('Excel to PDF conversion failed: ' + err.message);
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
        extraInfo={`Converted ${sheets.length} spreadsheet sheet${sheets.length > 1 ? 's' : ''}`}
      />
    );
  }

  if (!file) {
    return <DropZone accept=".xlsx,.xls,.csv" onFiles={handleFiles} />;
  }

  const activeSheet = sheets[activeSheetIdx];

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Page Layout
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
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
                Landscape (Recommended)
              </button>
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
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {sheets.length} Worksheet{sheets.length > 1 ? 's' : ''} Found
          </div>
        </div>

        {/* Sheet Tabs */}
        {sheets.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {sheets.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSheetIdx(idx)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  background: activeSheetIdx === idx ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: activeSheetIdx === idx ? 'var(--success)' : 'var(--text-secondary)',
                  border: `1px solid ${activeSheetIdx === idx ? 'var(--success)' : 'var(--border)'}`,
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* Spreadsheet Preview & PDF Print Container */}
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Worksheet Preview
          </span>

          <div
            style={{
              maxHeight: '360px',
              overflow: 'auto',
              background: '#ffffff',
              color: '#1e293b',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <div ref={previewRef} style={{ background: '#fff', color: '#1e293b' }}>
              <style>{`
                .excel-pdf-table table {
                  border-collapse: collapse;
                  width: 100%;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 11px;
                }
                .excel-pdf-table th, .excel-pdf-table td {
                  border: 1px solid #cbd5e1;
                  padding: 6px 10px;
                  text-align: left;
                }
                .excel-pdf-table tr:first-child td, .excel-pdf-table th {
                  background-color: #f1f5f9;
                  font-weight: bold;
                  color: #0f172a;
                }
                .excel-pdf-table tr:nth-child(even) td {
                  background-color: #f8fafc;
                }
              `}</style>

              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                  {activeSheet?.name || 'Sheet'}
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Exported from {file.name}
                </span>
              </div>

              <div
                className="excel-pdf-table"
                dangerouslySetInnerHTML={{ __html: activeSheet?.html || '' }}
              />
            </div>
          </div>
        </div>

        {busy && <ProgressBar progress={progress} label="Converting Spreadsheet to PDF…" />}

        {!busy && (
          <button
            onClick={convertToPdf}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Convert Excel to PDF
          </button>
        )}
      </div>
    </div>
  );
}
