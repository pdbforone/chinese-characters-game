import type { Metadata } from 'next';
import './globals.css';
import ErrorBoundary from './components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Chinese Characters Learning Game | RTH Method',
  description:
    'Master 3,035 Traditional Chinese Characters through story-based memory and progressive difficulty testing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
