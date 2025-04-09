'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { Article } from '@/app/types/article';
import ArticleCard from './ArticleCard';

interface CategorySectionProps {
  category: string;
  articles: Article[];
  searchQuery?: string;
  isSingleCategory?: boolean;
  gridView?: boolean;
}

const CategorySection = ({ 
  category, 
  articles, 
  searchQuery = '',
  isSingleCategory = false,
  gridView = false
}: CategorySectionProps) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);
  
  // If we have a search query, provide this information to the ArticleCard component
  const hasSearchQuery = searchQuery.trim().length > 0;
  
  // Generate a unique category color that's consistent with Pepper branding
  const categoryColorClass = useMemo(() => {
    // Simple hash function to get a consistent color for each category
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colorIndex = Math.abs(hash % 7);
    
    // Use a mix of Pepper brand colors and complementary palette
    const colorClasses = [
      'from-pepper-red to-pepper-orange', // Pepper brand gradient
      'from-primary-600 to-primary-700', // Blue
      'from-emerald-500 to-emerald-600', // Green
      'from-violet-500 to-violet-600', // Purple
      'from-amber-500 to-amber-600', // Amber
      'from-rose-500 to-rose-600', // Rose
      'from-indigo-500 to-indigo-600', // Indigo
    ];
    
    return colorClasses[colorIndex];
  }, [category]);
  
  // Simplified animation - less demanding on main thread
  const categoryColor = useMemo(() => 
    categoryColorClass.split(' ')[0].split('-')[1], 
    [categoryColorClass]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
      <button 
        className="relative bg-gradient-to-r w-full p-4 flex justify-between items-center cursor-pointer transition-all border-b border-gray-100 dark:border-gray-700 text-left"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-controls={`panel-${category}`}
      >
        {/* Colored category indicator */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${categoryColorClass}`} />
        
        <div className="flex items-center">
          {/* Category icon with gradient matching the indicator */}
          <div className={`mr-3 bg-gradient-to-br ${categoryColorClass} rounded-full p-2 text-white`}>
            <FiShoppingBag className="h-5 w-5" aria-hidden="true" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex flex-wrap items-center">
            {category} 
            <span className="ml-2 text-gray-500 dark:text-gray-400 text-base font-normal">
              ({articles.length})
            </span>
            
            {hasSearchQuery && (
              <span className="flex items-center ml-2 text-sm font-normal text-gray-600 dark:text-gray-400 italic">
                <FiSearch className="mr-1 h-3 w-3" aria-hidden="true" />
                {searchQuery}
              </span>
            )}
          </h2>
        </div>
        
        <div
          className="text-gray-500 dark:text-gray-400 p-1 transform transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <FiChevronDown className="h-5 w-5" />
        </div>
      </button>
      
      {/* Simplified animation - use CSS transitions instead of motion when possible */}
      {expanded && (
        <div 
          className="p-4 animate-fadeIn" 
          id={`panel-${category}`}
        >
          {gridView ? (
            // Grid view - 4 articles per row
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={`${article.link}-${index}`}
                  article={article} 
                  searchQuery={hasSearchQuery ? searchQuery : undefined}
                  index={index}
                  isFullWidth={false}
                  categoryColor={categoryColor}
                />
              ))}
            </div>
          ) : (
            // List view - horizontal articles
            <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
              {articles.map((article, index) => (
                <div key={`${article.link}-${index}`} className={index > 0 ? 'pt-4' : ''}>
                  <ArticleCard 
                    article={article} 
                    searchQuery={hasSearchQuery ? searchQuery : undefined}
                    index={index}
                    isFullWidth={true}
                    categoryColor={categoryColor}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CategorySection); 