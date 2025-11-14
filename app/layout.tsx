import type { Metadata } from 'next';
import './globals.css';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPrompt from './components/InstallPrompt';

export const metadata: Metadata = {
  title: 'Chinese Characters Learning Game | RTH Method',
  description:
    'Master 3,035 Traditional Chinese Characters through story-based memory and progressive difficulty testing',
  manifest: '/manifest.json',
  themeColor: '#4F46E5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '汉字 Game',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="汉字 Game" />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ErrorBoundary>{children}</ErrorBoundary>
        <InstallPrompt />
      </body>
    </html>
  );
}
