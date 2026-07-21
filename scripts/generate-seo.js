import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data/tools.js';
import { BLOGS } from '../src/data/blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://lovemypdf.online';

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Home
  xml += `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Tools
  for (const t of TOOLS) {
    xml += `  <url>\n    <loc>${SITE_URL}/${t.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }
  
  // Blog Index
  xml += `  <url>\n    <loc>${SITE_URL}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  
  // Blog Posts
  for (const b of BLOGS) {
    xml += `  <url>\n    <loc>${SITE_URL}/blog/${b.slug}</loc>\n    <lastmod>${b.date.split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }
  
  xml += `</urlset>`;
  
  const p = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(p, xml);
  console.log(`Generated ${p}`);
}

function generateRobots() {
  const txt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  const p = path.join(__dirname, '../public/robots.txt');
  fs.writeFileSync(p, txt);
  console.log(`Generated ${p}`);
}

generateSitemap();
generateRobots();
