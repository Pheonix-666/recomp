/**
 * ResultBanner — success state shown after processing completes.
 * Props:
 *   resultBlob  {Blob}     — the processed file
 *   fileName    {string}   — download filename
 *   onReset     {function} — called when "Process Another" is clicked
 *   extraInfo   {string}   — optional extra info line (e.g. "Saved 45%")
 */
export default function ResultBanner({ resultBlob, fileName, onReset, extraInfo }) {
  const download = () => {
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-2 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-3xl">check_circle</span>
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-1">Done!</h3>
      {extraInfo && (
        <p className="text-sm font-medium text-green-700 mb-2">{extraInfo}</p>
      )}
      <p className="text-sm text-green-700 mb-6">Your file is ready to download.</p>
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={download}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md"
        >
          <span className="material-symbols-outlined text-xl">download</span> Download
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl border border-[var(--color-outline-variant)] font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
        >
          Process Another
        </button>
      </div>
    </div>
  );
}
