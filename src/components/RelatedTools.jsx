import { Link } from 'react-router-dom';
import { getToolsByIds } from '../data/tools';

/**
 * RelatedTools — horizontal strip of related tool cards with internal links.
 * Props:
 *   toolIds  {string[]}  — array of tool ids to show
 */
export default function RelatedTools({ toolIds }) {
  const tools = getToolsByIds(toolIds);
  if (!tools.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {tools.map(tool => (
        <Link
          key={tool.id}
          to={`/${tool.slug}`}
          className="flex items-center gap-3 p-4 bg-white border border-[var(--color-outline-variant)] rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-[var(--color-surface-container-high)] text-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-xl">{tool.icon}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--color-on-surface)]">{tool.title}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-1">{tool.intro?.slice(0, 60)}…</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
