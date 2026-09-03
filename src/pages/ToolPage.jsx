import { Suspense, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getToolBySlug } from '../data/tools';
import SEOHead from '../components/SEOHead';
import { buildWebApplicationSchema, buildFAQSchema } from '../utils/seoSchemas';
import Breadcrumbs from '../components/Breadcrumbs';
import HowToSection from '../components/HowToSection';
import FAQAccordion from '../components/FAQAccordion';
import BenefitsGrid from '../components/BenefitsGrid';
import RelatedTools from '../components/RelatedTools';
import * as ToolComponents from '../tools';

export default function ToolPage() {
  const { toolSlug } = useParams();
  const tool = getToolBySlug(toolSlug);

  // Map tool id to the lazy-loaded component
  const ToolWidget = useMemo(() => {
    if (!tool) return null;
    const compName = tool.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Tool';
    return ToolComponents[compName] || ToolComponents.MockTool;
  }, [tool]);

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

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

      {/* Hero area */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 24px 0',
        textAlign: 'center',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(circle, rgba(230,57,70,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Breadcrumbs items={[{ name: tool.category, path: '/' }, { name: tool.title, path: `/${tool.slug}` }]} />

          {/* Tool icon */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--brand-dim), var(--brand))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '20px auto 20px',
            boxShadow: '0 8px 32px rgba(230,57,70,0.4)',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
              {tool.icon}
            </span>
          </div>

          <h1 className="anim-fade-up" style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-1.5px',
            color: 'var(--text-primary)',
            marginBottom: '14px',
          }}>
            {tool.h1}
          </h1>
          <p className="anim-fade-up-1" style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '600px', margin: '0 auto 40px',
          }}>
            {tool.intro}
          </p>
        </div>
      </div>

      {/* Tool widget */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '32px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
          minHeight: '300px',
        }}>
          <Suspense fallback={<ToolSkeleton />}>
            <ToolWidget tool={tool} />
          </Suspense>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[
            { icon: 'lock', label: 'Secure' },
            { icon: 'bolt', label: 'Fast' },
            { icon: 'public', label: 'Private' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--success)' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── SEO Content Sections ────────────────────────────────── */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: '64px' }}>

        {/* How to use */}
        {tool.howToSteps && (
          <section>
            <SectionHeader title={`How to use our ${tool.title}`} />
            <HowToSection steps={tool.howToSteps} />
          </section>
        )}

        {/* Benefits */}
        {tool.benefits && (
          <section>
            <SectionHeader title="Why use PDF Precision?" />
            <BenefitsGrid benefits={tool.benefits} />
          </section>
        )}

        {/* FAQ */}
        {tool.faqs && (
          <section style={{ maxWidth: '660px', margin: '0 auto', width: '100%' }}>
            <SectionHeader title="Frequently Asked Questions" />
            <FAQAccordion faqs={tool.faqs} />
          </section>
        )}

        {/* Related Tools */}
        {tool.relatedTools && (
          <section>
            <SectionHeader title="Related Tools" />
            <RelatedTools toolIds={tool.relatedTools} />
          </section>
        )}
      </div>
    </>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
        {title}
      </h2>
      <div style={{
        width: '48px', height: '3px', borderRadius: '99px',
        background: 'linear-gradient(90deg, var(--brand-dim), var(--brand))',
        margin: '0 auto',
      }} />
    </div>
  );
}

function ToolSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'pulse 2s infinite' }}>
      <div style={{ height: '180px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', border: '2px dashed var(--border)' }} />
      <div style={{ height: '48px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }} />
    </div>
  );
}
