import { useCallback, useState } from 'react';

/**
 * DropZone — drag-and-drop or click-to-upload file input.
 * Props:
 *   accept    {string}    — file accept string, e.g. ".pdf" or "image/*"
 *   multi     {boolean}   — allow multiple files
 *   onFiles   {function}  — called with File[] when files are chosen
 */
export default function DropZone({ accept = '*', multi = false, onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useCallback(node => { if (node) node.value = ''; }, []);

  const handle = (fileList) => {
    const arr = Array.from(fileList);
    onFiles(multi ? arr : arr.slice(0, 1));
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => document.getElementById('dz-input')?.click()}
      className={`border-2 border-dashed rounded-2xl p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? 'border-[var(--color-primary)] bg-[var(--color-surface-container-low)] scale-[1.01]'
          : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]'
      }`}
    >
      <input
        id="dz-input"
        ref={inputRef}
        type="file"
        multiple={multi}
        accept={accept}
        className="hidden"
        onChange={e => handle(e.target.files)}
      />
      <div className="w-20 h-20 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-5 shadow-inner">
        <span className="material-symbols-outlined text-[44px]">upload_file</span>
      </div>
      <p className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">
        {dragging ? 'Release to upload' : 'Drop files here'}
      </p>
      <p className="text-sm text-[var(--color-on-surface-variant)]">or click to browse from your device</p>
      <p className="text-xs text-[var(--color-outline)] mt-3">
        {multi ? 'Multiple files supported' : 'Single file'} · {accept}
      </p>
    </div>
  );
}
