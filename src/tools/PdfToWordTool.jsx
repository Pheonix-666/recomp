import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { formatSize } from '../utils';

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [result, setResult] = useState(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setStatusMsg('');
  };

  const convertPdfToWord = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(10);
    setStatusMsg('Loading PDF document…');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const totalPages = pdf.numPages;

      const { Document, Paragraph, TextRun, HeadingLevel, Packer } = await import('docx');

      const docParagraphs = [];
      let totalWords = 0;

      for (let i = 1; i <= totalPages; i++) {
        setStatusMsg(`Extracting text from page ${i} of ${totalPages}…`);
        setProgress(Math.round(10 + (i / totalPages) * 60));

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Add Page separator or header if multiple pages
        if (i > 1) {
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `\n[--- Page ${i} ---]\n`,
                  color: '888888',
                  size: 18,
                  italics: true,
                }),
              ],
            })
          );
        }

        // Group items into lines based on vertical 'y' coordinate
        const items = textContent.items.filter(it => it.str && it.str.trim());
        if (items.length === 0) continue;

        // Group by approximate line Y (within 4 units)
        const lines = [];
        let currentLine = [];
        let lastY = null;

        for (const item of items) {
          const y = item.transform ? item.transform[5] : 0;
          if (lastY === null || Math.abs(y - lastY) < 4) {
            currentLine.push(item);
          } else {
            lines.push(currentLine);
            currentLine = [item];
          }
          lastY = y;
        }
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        // Convert grouped lines to docx paragraphs
        for (const line of lines) {
          const lineText = line.map(it => it.str).join(' ').trim();
          if (!lineText) continue;
          totalWords += lineText.split(/\s+/).length;

          // Detect heading by height/fontSize
          const avgHeight = line.reduce((acc, it) => acc + (it.height || 12), 0) / line.length;
          const isHeading = avgHeight >= 16;
          const isSubheading = avgHeight >= 13 && avgHeight < 16;

          docParagraphs.push(
            new Paragraph({
              heading: isHeading ? HeadingLevel.HEADING_1 : isSubheading ? HeadingLevel.HEADING_2 : undefined,
              children: [
                new TextRun({
                  text: lineText,
                  bold: isHeading || isSubheading,
                  size: isHeading ? 32 : isSubheading ? 26 : 22, // half-points
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }
      }

      setStatusMsg('Compiling DOCX document…');
      setProgress(85);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docParagraphs.length > 0 ? docParagraphs : [
              new Paragraph({
                children: [new TextRun('No text could be extracted from the uploaded PDF document.')],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      setProgress(100);

      setResult({
        blob,
        fileName: `${file.name.replace(/\.[^/.]+$/, '')}.docx`,
        pagesCount: totalPages,
        wordsCount: totalWords,
        size: blob.size,
      });
    } catch (err) {
      console.error(err);
      alert('PDF to Word conversion failed: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  const downloadDocx = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '20px',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>description</span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            DOCX File Ready!
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            Converted {result.pagesCount} page{result.pagesCount > 1 ? 's' : ''} ({result.wordsCount} words) into editable Word format • {formatSize(result.size)}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={downloadDocx}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--brand)', color: '#fff',
                padding: '12px 24px', borderRadius: '12px',
                border: 'none', fontWeight: 700, fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 4px 15px var(--brand-glow)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
              Download Word Document (.docx)
            </button>

            <button
              onClick={reset}
              style={{
                padding: '12px 20px', borderRadius: '12px',
                border: '1px solid var(--border)', background: 'none',
                color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Convert Another File
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!file) {
    return <DropZone accept=".pdf" onFiles={fs => setFile(fs[0])} />;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--brand)' }}>
            article
          </span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Standard Word (.docx) Output
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Preserves text paragraphs, headings, typography, and page structure into fully editable DOCX.
            </div>
          </div>
        </div>

        {busy && <ProgressBar progress={progress} label={statusMsg} />}

        {!busy && (
          <button
            onClick={convertPdfToWord}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Convert PDF to Word
          </button>
        )}
      </div>
    </div>
  );
}
