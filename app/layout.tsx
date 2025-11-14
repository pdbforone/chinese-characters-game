import type { Metadata } from 'next';
import './globals.css';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPrompt from './components/InstallPrompt';

export const metadata: Metadata = {
  title: '汉字 Learning Game - Master Chinese Characters',
  description:
    'Master 3,035 Traditional Chinese Characters. Created by Paul David Burton using his tone-onomatopoeia mnemonic system, built upon Remembering Traditional Hanzi by Heisig & Richardson.',
  manifest: '/manifest.json',
  themeColor: '#4F46E5',
  openGraph: {
    title: '汉字 Learning Game by Paul David Burton',
    description:
      'Master 3,035 Traditional Chinese Characters using the Paul David Burton mnemonic method - story-based memory with tone-encoding onomatopoeia. Built upon Remembering Traditional Hanzi by Heisig & Richardson.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '汉字 Learning Game by Paul David Burton',
    description:
      'Master 3,035 Traditional Chinese Characters with tone-based onomatopoeia mnemonics. Built upon Remembering Traditional Hanzi by Heisig & Richardson.',
  },
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
