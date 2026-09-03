import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL, SITE_DESC } from '../utils/seoSchemas';

const OG_IMAGE = `${SITE_URL}/og-image.png`;

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
