import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead title="Page Not Found | PDF Precision" noIndex={true} />
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-[80px] text-[var(--color-primary)] mb-6">find_in_page</span>
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-on-surface)] mb-4 tracking-tight">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-on-surface-variant)] mb-8">Oops! We couldn't find that page.</h2>
        <p className="text-[var(--color-on-surface-variant)] mb-10 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md text-lg">
          Go back to Homepage
        </Link>
      </div>
    </>
  );
}
