import { Link } from 'react-router-dom';
import { BLOGS } from '../data/blogs';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

export default function BlogListPage() {
  return (
    <>
      <SEOHead
        title="PDF Precision Blog – PDF Tips, Guides & Tutorials"
        description="Read the latest articles, guides, and tips about managing PDF files. Learn how to compress, merge, convert, and secure your documents."
        canonical="/blog"
      />
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-10">
        <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }]} />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-on-surface)] mb-4">PDF Precision Blog</h1>
          <p className="text-lg text-[var(--color-on-surface-variant)]">Guides, tips, and tutorials for managing your digital documents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOGS.map(blog => (
            <Link key={blog.id} to={`/blog/${blog.slug}`} className="group flex flex-col h-full bg-white border border-[var(--color-outline-variant)] rounded-2xl overflow-hidden hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300">
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">{blog.category}</span>
                  <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">{new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{blog.title}</h2>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-6 flex-grow">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-[var(--color-on-surface-variant)] flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> {blog.readTime}</span>
                  <span className="text-[var(--color-primary)] flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <span className="material-symbols-outlined text-[18px]">arrow_forward</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
