import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'PDF Precision';
const SITE_URL  = 'https://lovemypdf.online';
const SITE_DESC = 'Free online PDF tools — compress, merge, split, convert, and secure PDFs in your browser. 100% private, no upload, no account needed.';
const OG_IMAGE  = `${SITE_URL}/og-image.png`;

/**
 * SEOHead — renders all meta tags, Open Graph, Twitter Card, and JSON-LD schema.
 *
 * Props:
 *   title       {string}   — page <title>
 *   description {string}   — meta description
 *   canonical   {string}   — canonical URL path, e.g. "/pdf-compressor"
 *   schemas     {Array}    — array of JSON-LD schema objects
 *   noIndex     {boolean}  — set true to add noindex
 */
export default function SEOHead({ title, description, canonical, schemas = [], noIndex = false }) {
  const fullTitle    = title || SITE_NAME;
  const fullDesc     = description || SITE_DESC;
  const canonicalURL = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <link rel="canonical" href={canonicalURL} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:url"         content={canonicalURL} />
      <meta property="og:image"       content={OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image"       content={OG_IMAGE} />

      {/* JSON-LD Schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

/* ── Schema Builders ───────────────────────────────────────────────────── */

export const SITE_URL_BASE = SITE_URL;

export function buildWebApplicationSchema(tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${SITE_URL}/${tool.slug}`,
    description: tool.metaDescription,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function buildFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildArticleSchema(blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.metaDescription,
    datePublished: blog.date,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/blog/${blog.slug}`,
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: SITE_DESC,
    sameAs: [],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
