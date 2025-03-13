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
}

const CategorySection = ({ 
  category, 
  articles, 
  searchQuery = '',
  isSingleCategory = false
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
  
  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
      <div 
        className="relative bg-gradient-to-r p-4 flex justify-between items-center cursor-pointer transition-all border-b border-gray-100"
        onClick={toggleExpanded}
      >
        {/* Colored category indicator */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${categoryColorClass}`} />
        
        <div className="flex items-center">
          {/* Category icon with gradient matching the indicator */}
          <div className={`mr-3 bg-gradient-to-br ${categoryColorClass} rounded-full p-2 text-white`}>
            <FiShoppingBag className="h-5 w-5" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 flex flex-wrap items-center">
            {category} 
            <span className="ml-2 text-gray-500 text-base font-normal">
              ({articles.length})
            </span>
            
            {hasSearchQuery && (
              <span className="flex items-center ml-2 text-sm font-normal text-gray-600 italic">
                <FiSearch className="mr-1 h-3 w-3" />
                {searchQuery}
              </span>
            )}
          </h2>
        </div>
        
        <motion.button 
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-pepper-red focus:ring-opacity-50 rounded-full p-1"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-label={expanded ? 'Zwiń kategorię' : 'Rozwiń kategorię'}
        >
          <FiChevronDown className="h-5 w-5" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="p-4"
          >
            <div className="space-y-4 divide-y divide-gray-100">
              {articles.map((article, index) => (
                <div key={`${article.link}-${index}`} className={index > 0 ? 'pt-4' : ''}>
                  <ArticleCard 
                    article={article} 
                    searchQuery={hasSearchQuery ? searchQuery : undefined}
                    index={index}
                    isFullWidth={true}
                    categoryColor={categoryColorClass.split(' ')[0].split('-')[1]}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(CategorySection); 