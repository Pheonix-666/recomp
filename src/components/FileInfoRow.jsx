import { formatSize } from '../utils';

/**
 * FileInfoRow — displays a file name + size with an optional remove button.
 * Props:
 *   f        {File}      — file object
 *   onRemove {function}  — called when remove button clicked; omit to hide button
 */
export default function FileInfoRow({ f, onRemove }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-outline-variant)]">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="material-symbols-outlined text-[var(--color-primary)] shrink-0">insert_drive_file</span>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{f.name}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">{formatSize(f.size)}</p>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors"
          aria-label="Remove file"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
}
