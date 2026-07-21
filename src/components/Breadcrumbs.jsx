import { Link, useLocation } from 'react-router-dom';
import { buildBreadcrumbSchema } from './SEOHead';
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
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-on-surface-variant)] mb-6">
        <ol className="flex items-center gap-1 flex-wrap">
          <li>
            <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
              {i === crumbs.length - 1 ? (
                <span className="text-[var(--color-on-surface)] font-medium" aria-current="page">{c.name}</span>
              ) : (
                <Link to={c.path} className="hover:text-[var(--color-primary)] transition-colors">{c.name}</Link>
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
