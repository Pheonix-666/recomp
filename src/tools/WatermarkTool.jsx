import { useState } from 'react';
import DropZone from '../components/DropZone';
import FileInfoRow from '../components/FileInfoRow';
import ProgressBar from '../components/ProgressBar';
import ResultBanner from '../components/ResultBanner';

const WATERMARK_COLORS = [
  { name: 'Crimson', hex: '#dc2626', rgb: [0.86, 0.15, 0.15] },
  { name: 'Navy', hex: '#1e40af', rgb: [0.12, 0.25, 0.69] },
  { name: 'Charcoal', hex: '#374151', rgb: [0.22, 0.25, 0.32] },
  { name: 'Emerald', hex: '#059669', rgb: [0.02, 0.59, 0.41] },
  { name: 'Slate', hex: '#64748b', rgb: [0.39, 0.45, 0.55] },
];

export default function WatermarkTool() {
  const [file, setFile] = useState(null);
  const [wmType, setWmType] = useState('text'); // 'text' | 'image'
  const [text, setText] = useState('CONFIDENTIAL');
  const [selectedColor, setSelectedColor] = useState(WATERMARK_COLORS[0]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [position, setPosition] = useState('diagonal'); // 'diagonal' | 'center' | 'top-right' | 'bottom-right'
  const [opacity, setOpacity] = useState(0.35);
  const [fontSize, setFontSize] = useState(48);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setFile(null);
    setResult(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => setImagePreview(evt.target.result);
    reader.readAsDataURL(f);
  };

  const run = async () => {
    setBusy(true);
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();

      if (wmType === 'text') {
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const [r, g, b] = selectedColor.rgb;
        const color = rgb(r, g, b);

        pages.forEach(page => {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(text, fontSize);

          let x = (width - textWidth) / 2;
          let y = (height - fontSize) / 2;
          let rotateAngle = 0;

          if (position === 'diagonal') {
            rotateAngle = 45;
            x = (width - textWidth * 0.7) / 2;
            y = (height - textWidth * 0.7) / 2;
          } else if (position === 'top-right') {
            x = width - textWidth - 36;
            y = height - fontSize - 36;
          } else if (position === 'bottom-right') {
            x = width - textWidth - 36;
            y = 36;
          }

          page.drawText(text, {
            x,
            y,
            size: fontSize,
            font,
            color,
            rotate: degrees(rotateAngle),
            opacity,
          });
        });
      } else if (wmType === 'image' && imageFile) {
        const imgBytes = await imageFile.arrayBuffer();
        let embeddedImg;
        if (imageFile.type.includes('png')) {
          embeddedImg = await doc.embedPng(imgBytes);
        } else {
          embeddedImg = await doc.embedJpg(imgBytes);
        }

        const scaleFactor = 0.4;
        const imgW = embeddedImg.width * scaleFactor;
        const imgH = embeddedImg.height * scaleFactor;

        pages.forEach(page => {
          const { width, height } = page.getSize();
          let x = (width - imgW) / 2;
          let y = (height - imgH) / 2;

          if (position === 'top-right') {
            x = width - imgW - 36;
            y = height - imgH - 36;
          } else if (position === 'bottom-right') {
            x = width - imgW - 36;
            y = 36;
          }

          page.drawImage(embeddedImg, {
            x,
            y,
            width: imgW,
            height: imgH,
            opacity,
          });
        });
      }

      const bytes = await doc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) {
      alert('Watermark failed: ' + e.message);
    }
    setBusy(false);
  };

  if (result) {
    return (
      <ResultBanner
        resultBlob={result}
        fileName={`watermarked_${file.name}`}
        onReset={reset}
        extraInfo={`Applied ${wmType === 'text' ? `text "${text}"` : 'custom image'} watermark to all pages`}
      />
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
        {/* Watermark Type Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setWmType('text')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: wmType === 'text' ? 'var(--brand)' : 'rgba(255,255,255,0.04)',
              color: wmType === 'text' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${wmType === 'text' ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>branding_watermark</span>
            Text Watermark
          </button>
          <button
            type="button"
            onClick={() => setWmType('image')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: wmType === 'image' ? 'var(--brand)' : 'rgba(255,255,255,0.04)',
              color: wmType === 'image' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${wmType === 'image' ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>image</span>
            Image Watermark
          </button>
        </div>

        {wmType === 'text' ? (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Watermark Text
              </label>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={40}
                className="input-field"
                style={{ width: '100%', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Colors */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Stamp Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {WATERMARK_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor.name === c.name ? '2px solid #fff' : '2px solid transparent',
                      boxShadow: selectedColor.name === c.name ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                  {selectedColor.name}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '24px', border: '2px dashed var(--border)', borderRadius: '12px',
              cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--brand)', marginBottom: '8px' }}>
                add_photo_alternate
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {imageFile ? imageFile.name : 'Select Watermark Image / Logo'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                PNG (transparent) or JPG
              </span>
              <input type="file" accept="image/png,image/jpeg" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}

        {/* Sliders: Opacity & Font/Size */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Opacity: {Math.round(opacity * 100)}%
            </span>
            <input
              type="range" min="0.05" max="1" step="0.05"
              value={opacity} onChange={e => setOpacity(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--brand)' }}
            />
          </div>

          {wmType === 'text' && (
            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Font Size: {fontSize}pt
              </span>
              <input
                type="range" min="16" max="96" step="4"
                value={fontSize} onChange={e => setFontSize(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--brand)' }}
              />
            </div>
          )}
        </div>

        {/* Position */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Position
          </label>
          <select
            value={position}
            onChange={e => setPosition(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
          >
            {wmType === 'text' && <option value="diagonal">Diagonal Across Center (45°)</option>}
            <option value="center">Center Stamp</option>
            <option value="top-right">Top Right Corner</option>
            <option value="bottom-right">Bottom Right Corner</option>
          </select>
        </div>

        {/* Live Preview Box */}
        <div style={{
          height: '74px', background: '#ffffff', borderRadius: '10px',
          border: '1px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {wmType === 'text' ? (
            <span style={{
              fontSize: `${Math.min(fontSize * 0.5, 28)}px`,
              opacity,
              color: selectedColor.hex,
              transform: position === 'diagonal' ? 'rotate(-30deg)' : 'none',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {text || 'PREVIEW'}
            </span>
          ) : imagePreview ? (
            <img src={imagePreview} alt="Preview" style={{ maxHeight: '60px', opacity, objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Select an image to preview</span>
          )}
        </div>

        {busy && <ProgressBar progress={70} label="Applying watermark to all pages…" />}

        {!busy && (
          <button
            onClick={run}
            disabled={wmType === 'text' ? !text.trim() : !imageFile}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Apply Watermark
          </button>
        )}
      </div>
    </div>
  );
}
