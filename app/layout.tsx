import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Pepper Deals',
    default: 'Pepper Deals | Najlepsze promocje z Pepper.pl'
  },
  description: 'Przeglądaj najnowsze i najlepsze oferty z Pepper.pl, kategoryzowane i uporządkowane dla łatwego odkrywania.',
  keywords: 'promocje, zniżki, pepper, pepper.pl, zakupy, oferty, wyprzedaże, okazje, rabaty',
  authors: [{ name: 'Pepper Deals App' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Pepper Deals',
    title: 'Pepper Deals | Najlepsze promocje z Pepper.pl',
    description: 'Przeglądaj najnowsze i najlepsze oferty z Pepper.pl',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pepper Deals Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepper Deals | Najlepsze promocje z Pepper.pl',
    description: 'Przeglądaj najnowsze i najlepsze oferty z Pepper.pl',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'pl-PL': '/',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
              <div className="container-content py-4">
                <div className="flex justify-between items-center">
                  <a href="/" aria-label="Strona główna Pepper Deals">
                    <h1 className="text-2xl font-bold text-pepper-red">
                      Pepper Deals
                    </h1>
                  </a>
                  <nav aria-label="Menu główne">
                    <ul className="flex space-x-4">
                      <li>
                        <a href="/" className="hover:text-pepper-red transition-colors" aria-current="page">
                          Strona główna
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="hover:text-pepper-red transition-colors">
                          O nas
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
            
            <footer className="bg-gray-800 text-white py-6">
              <div className="container-content">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-300">
                      &copy; {new Date().getFullYear()} Pepper Deals. Wszelkie prawa zastrzeżone.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="/regulamin" className="text-gray-300 hover:text-white transition-colors">
                      Regulamin
                    </a>
                    <a href="/polityka-prywatnosci" className="text-gray-300 hover:text-white transition-colors">
                      Polityka prywatności
                    </a>
                    <a href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                      Kontakt
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
} 