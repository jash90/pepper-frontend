'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCachedArticlesV2 } from '@/app/lib/api';
import { Article } from '@/app/types/article';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import CategorySection from '@/app/components/CategorySection';
import ScrollToTop from '@/app/components/ScrollToTop';
import { FiRefreshCw, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  // Data fetching with React Query
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
  });

  const categorizedArticles = data?.categorizedArticles || {};
  const fromCache = data?.fromCache || false;
  const fromPepper = data?.fromPepper || false;
  const totalArticles = useMemo(() => 
    Object.values(categorizedArticles).reduce((sum, articles) => sum + articles.length, 0),
    [categorizedArticles]
  );

  // Filter articles based on search query and selected categories
  const filteredCategories = useMemo(() => {
    if (Object.keys(categorizedArticles).length === 0) return {};
    
    const query = searchQuery.toLowerCase().trim();
    const filtered: Record<string, Article[]> = {};
    
    Object.entries(categorizedArticles).forEach(([category, categoryArticles]) => {
      // Skip categories that don't match any of the selected categories (if any are selected)
      if (selectedCategories.length > 0 && !selectedCategories.includes(category)) return;
      
      // Filter by search query if one exists
      let matchingArticles = categoryArticles;
      if (query) {
        matchingArticles = categoryArticles.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.description.toLowerCase().includes(query) ||
          (article.price && article.price.toLowerCase().includes(query))
        );
      }
      
      if (matchingArticles.length > 0) {
        filtered[category] = matchingArticles;
      }
    });
    
    return filtered;
  }, [categorizedArticles, searchQuery, selectedCategories]);

  // Available categories for filter dropdown
  const categories = useMemo(() => 
    Object.keys(categorizedArticles).sort(),
    [categorizedArticles]
  );

  // Handler functions
  const handleRefresh = () => refetch();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const fetchFreshArticles = async () => {
    try {
      await fetchCachedArticlesV2(14, 999999, 10); // High minCached value forces fetching from Pepper
      refetch();
    } catch (error) {
      console.error("Failed to fetch fresh articles:", error);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } 
      // Otherwise add it to the selection
      return [...prev, category];
    });
  };

  const clearCategoryFilters = () => {
    setSelectedCategories([]);
    setShowFilters(false);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  // Page status variants
  const pageContentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="sm:px-8 xl:px-16 py-8">
      <motion.div 
        className="animate-fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Najlepsze oferty z Pepper.pl
        </h1>

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
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="btn-secondary py-2 px-4 flex items-center"
              aria-expanded={showFilters}
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            >
              <FiFilter className="mr-2" />
              <span>Filtry</span>
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="btn-secondary py-2 px-4 flex items-center"
              aria-label="Refresh data"
            >
              <FiRefreshCw className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="md:inline hidden">Odśwież</span>
            </button>
            
            <button
              onClick={fetchFreshArticles}
              className="btn-secondary py-2 px-4 flex items-center"
              aria-label="Fetch new data from Pepper"
            >
              <FiDownload className="mr-2" />
              <span className="md:inline hidden">Nowe Dane</span>
            </button>

            {/* Toggle Grid/List View */}
            <button
              onClick={() => setIsGridView(prev => !prev)}
              className={`py-2 px-4 flex items-center rounded-lg transition-colors ${
                isGridView 
                  ? 'bg-pepper-red text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={isGridView}
              aria-label={isGridView ? 'Switch to list view' : 'Switch to grid view'}
            >
              <span className="md:inline hidden">
                {isGridView ? '4 w rzędzie' : 'Lista'}
              </span>
              <span className="md:hidden">
                {isGridView ? '4×' : '1×'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="bg-gray-50 p-4 rounded-lg"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={filterVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Filtry kategorii:</div>
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
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategories.includes(category) 
                        ? 'bg-pepper-red text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="w-full text-sm text-gray-600">Wybrane kategorie:</div>
                  {selectedCategories.map(category => (
                    <div key={`selected-${category}`} 
                         className="flex items-center bg-pepper-red bg-opacity-10 px-3 py-1 rounded-full text-sm">
                      <span className="text-pepper-red">{category}</span>
                      <button 
                        onClick={() => handleCategorySelect(category)}
                        className="ml-2 text-pepper-red hover:text-pepper-orange"
                        aria-label={`Remove ${category} filter`}
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
          <div className="bg-red-50 border-l-4 border-pepper-red p-4 mb-8">
            <p className="text-pepper-red">
              Błąd: {error instanceof Error ? error.message : 'Nieznany błąd podczas ładowania ofert.'}
            </p>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Pobieranie i kategoryzowanie ofert...</p>
          </div>
        ) : Object.keys(filteredCategories).length > 0 ? (
          <motion.div 
            className="flex flex-col space-y-6"
            variants={pageContentVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(filteredCategories)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, articles]) => (
                <motion.div key={category} variants={pageContentVariants} className="w-full">
                  <CategorySection 
                    category={category} 
                    articles={articles}
                    searchQuery={searchQuery}
                    isSingleCategory={false}
                    gridView={isGridView}
                  />
                </motion.div>
              ))
            }
          </motion.div>
        ) : searchQuery || selectedCategories.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Brak wyników dla{searchQuery ? ` "${searchQuery}"` : ''} 
              {selectedCategories.length > 0 ? ` w wybranych kategoriach` : ''}
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Nie znaleziono ofert. Spróbuj ponownie później.</p>
          </div>
        )}

        <ScrollToTop />
      </motion.div>
    </div>
  );
} 