import { useParams, Navigate, Link } from 'react-router-dom';
import { getBlogBySlug, BLOGS } from '../data/blogs';
import SEOHead, { buildArticleSchema } from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

export default function BlogPostPage() {
  const { blogSlug } = useParams();
  const blog = getBlogBySlug(blogSlug);

  if (!blog) {
    return <Navigate to="/404" replace />;
  }

  const relatedBlogs = BLOGS.filter(b => b.id !== blog.id).slice(0, 3);

  return (
    <>
      <SEOHead
        title={blog.title}
        description={blog.metaDescription}
        canonical={`/blog/${blog.slug}`}
        schemas={[buildArticleSchema(blog)]}
      />
      <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-10">
        <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: blog.title, path: `/blog/${blog.slug}` }]} />

        <article className="mt-8 bg-white border border-[var(--color-outline-variant)] rounded-3xl p-8 md:p-14 shadow-sm mb-16">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">{blog.category}</span>
              <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">{new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-sm font-medium text-[var(--color-on-surface-variant)] flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> {blog.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-on-surface)] mb-6 leading-[1.2]">{blog.title}</h1>
            <p className="text-xl text-[var(--color-on-surface-variant)] leading-relaxed max-w-2xl mx-auto">{blog.excerpt}</p>
          </header>

          <div 
            className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-primary)] prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>

        <section>
          <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedBlogs.map(b => (
              <Link key={b.id} to={`/blog/${b.slug}`} className="group block bg-white border border-[var(--color-outline-variant)] rounded-xl p-5 hover:border-[var(--color-primary)] hover:shadow-md transition-all">
                <span className="block text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">{b.category}</span>
                <h3 className="font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2 line-clamp-2">{b.title}</h3>
                <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
