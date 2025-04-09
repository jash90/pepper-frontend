import { Suspense } from 'react';
import ClientHomePage from '@/app/components/ClientHomePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Najlepsze promocje z Pepper.pl | Okazje i zniżki',
  description: 'Przeglądaj najnowsze i najlepsze oferty z Pepper.pl. Znajdź okazje, rabaty i promocje kategoryzowane dla łatwego wyszukiwania.',
  keywords: 'pepper.pl, okazje, promocje, zniżki, oferty, rabaty, zakupy, deals, kupony',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Najlepsze promocje i okazje z Pepper.pl',
    description: 'Odkryj najlepsze okazje, promocje i zniżki z Pepper.pl - starannie wybrane i kategoryzowane',
    url: '/',
    siteName: 'Pepper Deals',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="sm:px-8 xl:px-16 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Najlepsze oferty z Pepper.pl
      </h1>
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-12 h-12 border-4 border-t-pepper-red rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Pobieranie i kategoryzowanie ofert...</p>
        </div>
      }>
        <ClientHomePage />
      </Suspense>
    </div>
  );
} 