'use client';

import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCachedArticlesV2 } from '@/app/lib/api';
import { Article } from '@/app/types/article';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import CategorySection from '@/app/components/CategorySection';
import dynamic from 'next/dynamic';
import { FiRefreshCw, FiDownload, FiSearch, FiFilter, FiList, FiGrid } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import the heavy component with no SSR
const ScrollToTop = dynamic(() => import('@/app/components/ScrollToTop'), {
  ssr: false,
});

// Reduced animation complexity
const simpleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export default function ClientHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  // Data fetching with React Query - optimized settings
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isRefetching 
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => fetchCachedArticlesV2(14, 150, 7),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const categorizedArticles = data?.categorizedArticles || {};
  const fromCache = data?.fromCache || false;
  const fromPepper = data?.fromPepper || false;
  
  // Memoized total calculation
  const totalArticles = useMemo(() => 
    Object.values(categorizedArticles).reduce((sum, articles) => sum + articles.length, 0),
    [categorizedArticles]
  );

  // Memoized filtering - optimized to prevent unnecessary iterations
  const filteredCategories = useMemo(() => {
    if (Object.keys(categorizedArticles).length === 0) return {};
    
    const query = searchQuery.toLowerCase().trim();
    const hasCategories = selectedCategories.length > 0;
    const hasQuery = query.length > 0;
    
    // Early return if no filtering needed
    if (!hasCategories && !hasQuery) return categorizedArticles;
    
    const filtered: Record<string, Article[]> = {};
    
    Object.entries(categorizedArticles).forEach(([category, categoryArticles]) => {
      // Skip categories that don't match selected categories
      if (hasCategories && !selectedCategories.includes(category)) return;
      
      // Skip filtering if no query
      if (!hasQuery) {
        filtered[category] = categoryArticles;
        return;
      }
      
      // Filter by search query
      const matchingArticles = categoryArticles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query) ||
        (article.price && article.price.toLowerCase().includes(query))
      );
      
      if (matchingArticles.length > 0) {
        filtered[category] = matchingArticles;
      }
    });
    
    return filtered;
  }, [categorizedArticles, searchQuery, selectedCategories]);

  // Available categories
  const categories = useMemo(() => 
    Object.keys(categorizedArticles).sort(),
    [categorizedArticles]
  );

  // Handler functions memoized with useCallback
  const handleRefresh = useCallback(() => refetch(), [refetch]);
  
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const fetchFreshArticles = useCallback(async () => {
    try {
      await fetchCachedArticlesV2(14, 999999, 10);
      refetch();
    } catch (error) {
      console.error("Failed to fetch fresh articles:", error);
    }
  }, [refetch]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  }, []);

  const clearCategoryFilters = useCallback(() => {
    setSelectedCategories([]);
    setShowFilters(false);
  }, []);

  const toggleGridView = useCallback(() => {
    setIsGridView(prev => !prev);
  }, []);

  // Render fewer items at once to reduce DOM size
  const renderCategories = useMemo(() => {
    return Object.entries(filteredCategories)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, isGridView ? 8 : 12);  // Limit number of sections displayed initially
  }, [filteredCategories, isGridView]);

  return (
    <div className="animate-fade-in">
      {!isLoading && Object.keys(categorizedArticles).length > 0 && (
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Znaleziono {totalArticles} ofert w {Object.keys(categorizedArticles).length} kategoriach
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className={`${fromCache ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'} 
                         px-3 py-1 rounded-full text-sm font-medium transition-all`}>
              {fromCache ? 'Załadowano z Cache' : 'Dane z Pepper.pl'}
            </span>
            
            {fromPepper && (
              <span className="bg-pepper-red bg-opacity-10 text-pepper-red px-3 py-1 rounded-full text-sm font-medium">
                Nowe dane z Pepper.pl
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Szukaj ofert..."
            className="input-form py-2 pl-10 pr-4 w-full"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Szukaj ofert"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="btn-secondary py-2 px-4 flex items-center"
            aria-expanded={showFilters}
            aria-label={showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
          >
            <FiFilter className="mr-2" aria-hidden="true" />
            <span>Filtry</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="btn-secondary py-2 px-4 flex items-center"
            aria-label="Odśwież dane"
          >
            <FiRefreshCw className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span className="md:inline hidden">Odśwież</span>
          </button>
          
          <button
            onClick={fetchFreshArticles}
            className="btn-secondary py-2 px-4 flex items-center"
            aria-label="Pobierz nowe dane z Pepper"
          >
            <FiDownload className="mr-2" aria-hidden="true" />
            <span className="md:inline hidden">Nowe Dane</span>
          </button>

          {/* Toggle Grid/List View */}
          <button
            onClick={toggleGridView}
            className={`py-2 px-4 flex items-center rounded-lg transition-colors ${
              isGridView 
                ? 'bg-pepper-red text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={isGridView}
            aria-label={isGridView ? 'Przełącz na widok listy' : 'Przełącz na widok siatki'}
          >
            {isGridView ? (
              <FiList className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FiGrid className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Category Filters - Simplified animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium dark:text-white">Filtry kategorii:</div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearCategoryFilters}
                  className="text-sm text-pepper-red hover:text-pepper-orange transition-colors"
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 15).map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category) 
                      ? 'bg-pepper-red text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
              {categories.length > 15 && (
                <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  +{categories.length - 15} więcej
                </button>
              )}
            </div>

            {selectedCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="w-full text-sm text-gray-600 dark:text-gray-300">Wybrane kategorie:</div>
                {selectedCategories.map(category => (
                  <div key={`selected-${category}`} 
                       className="flex items-center bg-pepper-red bg-opacity-10 px-3 py-1 rounded-full text-sm">
                    <span className="text-pepper-red">{category}</span>
                    <button 
                      onClick={() => handleCategorySelect(category)}
                      className="ml-2 text-pepper-red hover:text-pepper-orange"
                      aria-label={`Usuń filtr ${category}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-pepper-red p-4 mb-8">
          <p className="text-pepper-red dark:text-red-400">
            Błąd: {error instanceof Error ? error.message : 'Nieznany błąd podczas ładowania ofert.'}
          </p>
        </div>
      )}

      {/* Main Content - with simplified animations */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Pobieranie i kategoryzowanie ofert...</p>
        </div>
      ) : Object.keys(filteredCategories).length > 0 ? (
        <div className="flex flex-col space-y-6">
          {renderCategories.map(([category, articles]) => (
            <div key={category} className="w-full">
              <CategorySection 
                category={category} 
                articles={articles.slice(0, isGridView ? 12 : 6)} // Limit articles per category
                searchQuery={searchQuery}
                isSingleCategory={false}
                gridView={isGridView}
              />
            </div>
          ))}
          
          {/* Show "Load More" button if not all categories are displayed */}
          {Object.keys(filteredCategories).length > renderCategories.length && (
            <div className="flex justify-center mt-4">
              <button 
                className="btn-secondary py-2 px-6"
                onClick={() => {/* Logic to load more would go here */}}
              >
                Pokaż więcej kategorii ({Object.keys(filteredCategories).length - renderCategories.length})
              </button>
            </div>
          )}
        </div>
      ) : searchQuery || selectedCategories.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Brak wyników dla{searchQuery ? ` "${searchQuery}"` : ''} 
            {selectedCategories.length > 0 ? ` w wybranych kategoriach` : ''}
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">Nie znaleziono ofert. Spróbuj ponownie później.</p>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
} 