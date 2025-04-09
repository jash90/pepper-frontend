import React from 'react';
import { Metadata } from 'next';
import AboutPageClient from '@/app/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'O nas | Pepper Deals - Agregator promocji z Pepper.pl',
  description: 'Poznaj aplikację Pepper Deals, która zbiera i kategoryzuje najlepsze oferty z Pepper.pl, aby ułatwić Ci znalezienie najatrakcyjniejszych promocji i okazji zakupowych.',
  keywords: 'o nas, pepper deals, pepper.pl, promocje, okazje, aplikacja, zakupy, agregator, oferty',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'O aplikacji Pepper Deals - Agregator promocji z Pepper.pl',
    description: 'Poznaj aplikację Pepper Deals - nowoczesny sposób na wyszukiwanie i filtrowanie najlepszych ofert z Pepper.pl',
    url: '/about',
    siteName: 'Pepper Deals',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
} 