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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
      {tools.map(tool => (
        <Link
          key={tool.id}
          to={`/${tool.slug}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            textDecoration: 'none',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(230,57,70,0.35)';
            e.currentTarget.style.background = 'rgba(230,57,70,0.04)';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.querySelector('.rt-icon').style.background = 'linear-gradient(135deg, #c1121f, #e63946)';
            e.currentTarget.querySelector('.rt-icon').style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.querySelector('.rt-icon').style.background = 'var(--brand-subtle)';
            e.currentTarget.querySelector('.rt-icon').style.color = 'var(--brand)';
          }}
        >
          <div className="rt-icon" style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--brand-subtle)',
            color: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.25s ease',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{tool.icon}</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.title}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.intro?.slice(0, 50)}…</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
