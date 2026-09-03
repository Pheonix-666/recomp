import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

export default function PptToPdfTool() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlob, setResultBlob] = useState(null);

  const reset = () => {
    setFile(null);
    setSlides([]);
    setResultBlob(null);
    setProgress(0);
    setStatusMsg('');
  };

  const handleFiles = async (files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setBusy(true);
    setProgress(20);
    setStatusMsg('Unpacking PowerPoint presentation…');

    try {
      const JSZip = (await import('jszip')).default;
      const buf = await f.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);

      // Find all slide XML files
      const slideFiles = [];
      zip.forEach((relativePath) => {
        if (relativePath.match(/^ppt\/slides\/slide[0-9]+\.xml$/i)) {
          slideFiles.push(relativePath);
        }
      });

      // Sort slides in numerical order (slide1, slide2, slide10...)
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide([0-9]+)\.xml/i)?.[1] || '0', 10);
        const numB = parseInt(b.match(/slide([0-9]+)\.xml/i)?.[1] || '0', 10);
        return numA - numB;
      });

      if (slideFiles.length === 0) {
        throw new Error('No slides found in the presentation file. Please make sure this is a valid .pptx file.');
      }

      const parsedSlides = [];
      const parser = new DOMParser();

      for (let i = 0; i < slideFiles.length; i++) {
        const slidePath = slideFiles[i];
        const xmlText = await zip.file(slidePath).async('text');
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Extract text elements from paragraphs (<a:p>)
        const paragraphs = xmlDoc.getElementsByTagName('a:p');
        const textLines = [];

        for (let j = 0; j < paragraphs.length; j++) {
          const p = paragraphs[j];
          const textRuns = p.getElementsByTagName('a:t');
          let line = '';
          for (let k = 0; k < textRuns.length; k++) {
            line += textRuns[k].textContent;
          }
          if (line.trim()) {
            textLines.push(line.trim());
          }
        }

        const title = textLines[0] || `Slide ${i + 1}`;
        const content = textLines.slice(1);

        parsedSlides.push({
          index: i + 1,
          title,
          content: content.length > 0 ? content : ['(Empty slide content)'],
        });
      }

      setSlides(parsedSlides);
      setProgress(100);
      setStatusMsg('');
    } catch (err) {
      console.error(err);
      alert('Could not read PowerPoint presentation: ' + err.message);
      reset();
    } finally {
      setBusy(false);
    }
  };

  const convertToPdf = async () => {
    if (slides.length === 0) return;
    setBusy(true);
    setProgress(15);
    setStatusMsg('Rendering slides to presentation PDF…');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      // Standard 16:9 presentation slide dimensions (960 x 540)
      const slideW = 960;
      const slideH = 540;

      for (let i = 0; i < slides.length; i++) {
        setStatusMsg(`Rendering Slide ${i + 1} of ${slides.length}…`);
        setProgress(Math.round(15 + (i / slides.length) * 75));

        const slide = slides[i];
        const canvas = document.createElement('canvas');
        canvas.width = slideW;
        canvas.height = slideH;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, slideW, slideH);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, slideW, slideH);

        // Slide header bar
        ctx.fillStyle = '#e63946';
        ctx.fillRect(60, 50, 8, 44);

        // Slide Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.fillText(slide.title, 80, 84);

        // Accent divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 115);
        ctx.lineTo(slideW - 60, 115);
        ctx.stroke();

        // Slide Content / Bullet points
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px system-ui, -apple-system, sans-serif';

        let currentY = 170;
        for (const item of slide.content.slice(0, 8)) {
          // Bullet dot
          ctx.fillStyle = '#e63946';
          ctx.beginPath();
          ctx.arc(80, currentY - 7, 5, 0, Math.PI * 2);
          ctx.fill();

          // Text
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(item, 105, currentY);
          currentY += 42;
        }

        // Slide footer
        ctx.fillStyle = '#64748b';
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.fillText(file.name, 60, slideH - 35);
        ctx.fillText(`Slide ${slide.index} of ${slides.length}`, slideW - 160, slideH - 35);

        // Export canvas to PNG and embed in PDF
        const pngDataUrl = canvas.toDataURL('image/png');
        const pngBytes = await fetch(pngDataUrl).then(r => r.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);

        const page = pdfDoc.addPage([slideW, slideH]);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: slideW,
          height: slideH,
        });
      }

      setStatusMsg('Finalizing PDF document…');
      setProgress(95);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProgress(100);
      setResultBlob(blob);
    } catch (err) {
      console.error(err);
      alert('PowerPoint conversion failed: ' + err.message);
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
        extraInfo={`Converted ${slides.length} slides into 16:9 Presentation PDF`}
      />
    );
  }

  if (!file) {
    return <DropZone accept=".pptx,.ppt" onFiles={handleFiles} />;
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Presentation Preview
            </span>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {slides.length} Slide{slides.length > 1 ? 's' : ''} extracted
            </div>
          </div>

          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '99px', background: 'rgba(230,57,70,0.1)', color: 'var(--brand)',
          }}>
            16:9 HD Format
          </span>
        </div>

        {/* Slide Preview Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '14px',
          maxHeight: '340px',
          overflowY: 'auto',
          padding: '4px',
        }}>
          {slides.map(s => (
            <div
              key={s.index}
              style={{
                aspectRatio: '16/9',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: 'var(--brand)',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  Slide {s.index}
                </span>
                <h4 style={{
                  fontSize: '13px', fontWeight: 700, color: '#f8fafc',
                  margin: '4px 0 6px 0',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {s.title}
                </h4>
                <p style={{
                  fontSize: '11px', color: '#94a3b8', margin: 0,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4',
                }}>
                  {s.content.join(' • ')}
                </p>
              </div>

              <div style={{ fontSize: '9px', color: '#64748b', textAlign: 'right' }}>
                16:9 Landscape
              </div>
            </div>
          ))}
        </div>

        {busy && <ProgressBar progress={progress} label={statusMsg} />}

        {!busy && (
          <button
            onClick={convertToPdf}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Convert {slides.length} Slides to PDF
          </button>
        )}
      </div>
    </div>
  );
}
