import { Suspense, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getToolBySlug } from '../data/tools';
import SEOHead, { buildWebApplicationSchema, buildFAQSchema } from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import HowToSection from '../components/HowToSection';
import FAQAccordion from '../components/FAQAccordion';
import BenefitsGrid from '../components/BenefitsGrid';
import RelatedTools from '../components/RelatedTools';
import * as ToolComponents from '../tools';

export default function ToolPage() {
  const { toolSlug } = useParams();
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  // Map tool id to the lazy-loaded component
  const ToolWidget = useMemo(() => {
    const compName = tool.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Tool';
    return ToolComponents[compName] || ToolComponents.MockTool;
  }, [tool.id]);

  const schemas = [buildWebApplicationSchema(tool)];
  if (tool.faqs?.length > 0) {
    schemas.push(buildFAQSchema(tool.faqs));
  }

  return (
    <>
      <SEOHead
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`/${tool.slug}`}
        schemas={schemas}
      />
      <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <Breadcrumbs items={[{ name: tool.category, path: '/' }, { name: tool.title, path: `/${tool.slug}` }]} />

        {/* Top Section: Title & Tool Widget */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-on-surface)] mb-4 tracking-tight">{tool.h1}</h1>
            <p className="text-lg text-[var(--color-on-surface-variant)]">{tool.intro}</p>
          </div>
          
          <div className="bg-white border border-[var(--color-outline-variant)] rounded-2xl shadow-sm p-6 md:p-10 mb-8 min-h-[400px]">
            <Suspense fallback={<ToolSkeleton />}>
              <ToolWidget tool={tool} />
            </Suspense>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm font-medium text-[var(--color-on-surface-variant)]">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-green-600">lock</span> Secure</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-green-600">bolt</span> Fast</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-green-600">public</span> Private</span>
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* How to use */}
          {tool.howToSteps && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8 text-center">How to use our {tool.title}</h2>
              <HowToSection steps={tool.howToSteps} />
            </section>
          )}

          {/* Benefits */}
          {tool.benefits && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8 text-center">Why use PDF Precision?</h2>
              <BenefitsGrid benefits={tool.benefits} />
            </section>
          )}

          {/* FAQ */}
          {tool.faqs && (
            <section className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8 text-center">Frequently Asked Questions</h2>
              <FAQAccordion faqs={tool.faqs} />
            </section>
          )}

          {/* Related Tools */}
          {tool.relatedTools && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8 text-center">Related Tools</h2>
              <RelatedTools toolIds={tool.relatedTools} />
            </section>
          )}

        </div>
      </div>
    </>
  );
}

function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-[var(--color-surface-container-low)] rounded-2xl border-2 border-dashed border-[var(--color-outline-variant)]"></div>
      <div className="h-12 bg-[var(--color-surface-container-low)] rounded-xl"></div>
    </div>
  );
}
