import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../data/tools';
import SEOHead, { buildOrganizationSchema, buildWebSiteSchema } from '../components/SEOHead';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredTools = TOOLS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.intro?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Free PDF Tools Online – Compress, Convert, Merge & Edit | PDF Precision"
        description="All the PDF tools you need in one place. Compress, merge, edit, and convert PDF files online for free. Secure, fast, and 100% browser-based processing."
        canonical="/"
        schemas={[buildOrganizationSchema(), buildWebSiteSchema()]}
      />
      <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="mb-14 text-center">
          <h1 className="text-[40px] md:text-[56px] leading-[1.1] font-bold tracking-tight text-[var(--color-on-surface)] mb-4">
            All the PDF tools you need.
          </h1>
          <p className="text-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto mb-8">
            Precision tools for every document workflow. Compress, convert, edit, and secure your PDFs — entirely in your browser.
          </p>
          <div className="relative max-w-xl mx-auto group">
            <input
              className="w-full px-8 py-4 rounded-full border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 shadow-sm bg-white text-[var(--color-on-surface)] text-lg transition-all"
              placeholder="Search tools… e.g. 'Compress', 'Merge'"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors">
              search
            </span>
          </div>
        </section>

        {/* Tool Grid by Category */}
        <div className="space-y-12">
          {Object.keys(CATEGORIES).map((category, ci) => {
            const catTools = filteredTools.filter(t => t.category === category);
            if (catTools.length === 0) return null;
            const { icon, label } = CATEGORIES[category];
            return (
              <section key={category}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-xl text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <h2 className="text-2xl font-bold text-[var(--color-on-surface)]">{label}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {catTools.map(tool => (
                    <Link
                      key={tool.id}
                      to={`/${tool.slug}`}
                      className="tool-card flex flex-col bg-white border border-[var(--color-outline-variant)] p-6 rounded-2xl cursor-pointer group hover:border-[var(--color-primary)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
                    >
                      <div className="icon-box w-12 h-12 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-[var(--color-on-surface)]">{tool.title}</h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed flex-grow">
                        {tool.intro?.slice(0, 70)}…
                      </p>
                      {!tool.implemented && (
                        <span className="inline-block self-start mt-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md">Coming Soon</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          {filteredTools.length === 0 && (
            <div className="text-center py-24 text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] rounded-3xl">
              <span className="material-symbols-outlined text-[64px] mb-4 block opacity-50">search_off</span>
              <p className="text-lg font-medium">No tools found for "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-[var(--color-primary)] hover:underline font-semibold">Clear search</button>
            </div>
          )}
        </div>

        {/* Pro Banner */}
        <section className="mt-20 mb-10">
          <div className="relative bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden border border-[var(--color-outline-variant)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Go Pro. Get Precision.</h2>
              <p className="text-lg text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
                Unlock unlimited batch processing, high-fidelity OCR, larger file limits, and priority browser execution with PDF Precision Pro.
              </p>
              <button className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg text-lg w-full md:w-auto">
                Start 7-Day Free Trial
              </button>
            </div>
            <div className="hidden md:block z-10 w-64">
              <div className="bg-white rounded-2xl shadow-xl p-5 transform rotate-3 border border-[var(--color-outline-variant)]">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--color-outline-variant)]">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-sm">check</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-on-surface)]">Batch Complete</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-[var(--color-outline-variant)] rounded-full w-full" />
                  <div className="h-2 bg-[var(--color-outline-variant)] rounded-full w-4/5" />
                  <div className="h-2 bg-[var(--color-outline-variant)] rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
