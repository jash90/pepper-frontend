'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiSearch, FiFilter, FiTag, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function AboutPageClient() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const featureItems = [
    {
      icon: <FiShoppingBag />,
      title: 'Najlepsze oferty',
      description: 'Zbieramy i pokazujemy najlepsze oferty z serwisu Pepper.pl w jednym miejscu.',
    },
    {
      icon: <FiFilter />,
      title: 'Inteligentna kategoryzacja',
      description: 'Wszystkie oferty są automatycznie kategoryzowane, aby ułatwić przeglądanie.',
    },
    {
      icon: <FiSearch />,
      title: 'Wygodne wyszukiwanie',
      description: 'Łatwo znajdziesz oferty dzięki zaawansowanej funkcji wyszukiwania i filtrowania.',
    },
    {
      icon: <FiTag />,
      title: 'Szczegółowe informacje',
      description: 'Każda oferta zawiera wszystkie niezbędne informacje, takie jak cena, dostawa i opis.',
    },
    {
      icon: <FiRefreshCw />,
      title: 'Automatyczne aktualizacje',
      description: 'Oferty są regularnie aktualizowane, aby zawsze mieć dostęp do najnowszych promocji.',
    },
  ];

  return (
    <div className="container-content py-12">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100"
          variants={itemVariants}
        >
          O aplikacji Pepper Deals
        </motion.h1>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Co to jest Pepper Deals?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Pepper Deals to aplikacja, która zbiera, kategoryzuje i prezentuje najlepsze oferty z serwisu Pepper.pl. 
            Naszym celem jest ułatwienie użytkownikom znalezienia najlepszych promocji i okazji zakupowych w jednym miejscu.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Aplikacja wykorzystuje nowoczesne technologie do automatycznego pobierania i kategoryzowania ofert, 
            aby zapewnić użytkownikom jak najlepsze doświadczenie podczas przeglądania promocji.
          </p>
        </motion.div>

        <motion.h2 
          className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white"
          variants={itemVariants}
        >
          Główne funkcje
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          variants={itemVariants}
        >
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-pepper-red bg-opacity-10 p-3 rounded-full text-pepper-red mr-4">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Jak korzystać z aplikacji?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Korzystanie z Pepper Deals jest proste - wystarczy przeglądać oferty, filtrować je według kategorii lub 
            wyszukiwać konkretne produkty. Każda oferta zawiera link do oryginalnej strony, gdzie można dokonać zakupu.
          </p>
          <Link 
            href="/"
            className="btn-primary inline-flex items-center"
            aria-label="Przejdź do strony głównej z ofertami"
          >
            Przejdź do ofert
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-10 text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Skontaktuj się z nami</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Masz pytania lub sugestie? Chętnie Cię wysłuchamy!
          </p>
          <Link 
            href="/kontakt"
            className="text-pepper-red hover:text-pepper-red-dark transition-colors"
            aria-label="Przejdź do strony kontaktowej"
          >
            Formularz kontaktowy
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 