import { Link, useLocation } from 'react-router-dom';
import { buildBreadcrumbSchema } from '../utils/seoSchemas';
import { Helmet } from 'react-helmet-async';

/**
 * Breadcrumbs — auto-generates breadcrumbs from the current URL path.
 * Renders both visible breadcrumb trail and BreadcrumbList JSON-LD.
 *
 * Props:
 *   items  {Array<{name, path}>}  — optional explicit crumbs; auto-generated if not provided
 */
export default function Breadcrumbs({ items }) {
  const location = useLocation();

  const crumbs = items || generateCrumbs(location.pathname);
  const schema = buildBreadcrumbSchema([{ name: 'Home', path: '/' }, ...crumbs]);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <ol style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap' }}>
          <li>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Home
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-muted)', opacity: 0.5 }}>chevron_right</span>
              {i === crumbs.length - 1 ? (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }} aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

function generateCrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ name: segmentToLabel(seg), path });
  }
  return crumbs;
}

function segmentToLabel(seg) {
  return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
