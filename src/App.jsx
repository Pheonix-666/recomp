import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout wraps all routes with NavBar, Footer, and scroll restoration
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <NavBar />
      <main className="flex-grow flex flex-col items-center justify-start w-full">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:blogSlug', element: <BlogPostPage /> },
      { path: ':toolSlug', element: <ToolPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
