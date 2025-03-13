import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pepper Deals | Find the Best Deals from Pepper.pl',
  description: 'Browse the latest and best deals from Pepper.pl, categorized and organized for easy discovery.',
  keywords: 'deals, discounts, pepper, pepper.pl, shopping, offers, sales',
  authors: [{ name: 'Pepper Deals App' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-10">
              <div className="container-content py-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-pepper-red">
                    Pepper Deals
                  </h1>
                  <nav>
                    <ul className="flex space-x-4">
                      <li>
                        <a href="/" className="hover:text-pepper-red transition-colors">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="hover:text-pepper-red transition-colors">
                          About
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
                      &copy; {new Date().getFullYear()} Pepper Deals. All rights reserved.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      Terms
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      Privacy
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      Contact
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