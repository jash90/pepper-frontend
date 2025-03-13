'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiExternalLink, FiShoppingCart, FiTag } from 'react-icons/fi';
import { Article } from '@/app/types/article';

interface ArticleCardProps {
  article: Article;
  searchQuery?: string;
  index?: number;
  isFullWidth?: boolean;
  categoryColor?: string;
}

const ArticleCard = memo(function ArticleCard({ 
  article, 
  searchQuery,
  index = 0,
  isFullWidth = false,
  categoryColor = 'pepper-red'
}: ArticleCardProps) {
  const { title, price, shippingPrice, description, image, link } = article;
  
  // Determine if shipping is free
  const isFreeShipping = useMemo(() => {
    if (!shippingPrice) return false;
    return ['0 zł', 'Free', 'Za darmo', '0zł', '0 PLN'].some(
      term => shippingPrice.includes(term)
    );
  }, [shippingPrice]);
  
  // Get accent color class based on the category color
  const accentColorClass = useMemo(() => {
    // Default to pepper-red if no category color or it's not recognized
    if (!categoryColor) return 'pepper-red';
    
    // Map the color to appropriate Tailwind classes
    const colorMap: Record<string, string> = {
      'pepper-red': 'text-pepper-red hover:text-pepper-orange border-pepper-red',
      'pepper-orange': 'text-pepper-orange hover:text-pepper-red border-pepper-orange',
      'primary': 'text-primary-600 hover:text-primary-700 border-primary-600',
      'emerald': 'text-emerald-500 hover:text-emerald-600 border-emerald-500',
      'violet': 'text-violet-500 hover:text-violet-600 border-violet-500',
      'amber': 'text-amber-500 hover:text-amber-600 border-amber-500',
      'rose': 'text-rose-500 hover:text-rose-600 border-rose-500',
      'indigo': 'text-indigo-500 hover:text-indigo-600 border-indigo-500',
    };
    
    return colorMap[categoryColor] || 'text-pepper-red hover:text-pepper-orange border-pepper-red';
  }, [categoryColor]);
  
  // Highlight text if a search query is provided
  const highlightText = (text: string): React.ReactNode => {
    if (!searchQuery || !text) return text;
    
    const query = searchQuery.toLowerCase();
    const lowerText = text.toLowerCase();
    
    // If the query isn't in the text, just return the text
    if (!lowerText.includes(query)) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query ? 
            <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : 
            part
        )}
      </>
    );
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05,
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };
  
  // Color class for the price tag
  const priceColorClass = categoryColor === 'pepper-red' || !categoryColor 
    ? 'text-pepper-red' 
    : `text-${categoryColor}-500`;
  
  return (
    <motion.div 
      className={`card flex ${isFullWidth ? 'flex-row' : 'flex-col'} h-full group transition-all`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className={`relative ${isFullWidth ? 'w-1/4 min-w-[180px]' : 'h-48'} overflow-hidden bg-gray-100 ${isFullWidth ? 'rounded-r-none rounded-l-lg' : 'rounded-t-lg rounded-b-none'}`}>
        {image ? (
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full"
            aria-label={`View ${title} deal`}
          >
            <Image
              src={image}
              alt={title}
              width={300}
              height={200}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              priority={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          </Link>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 flex-col">
            <FiTag className="w-8 h-8 mb-2" />
            <span>Brak zdjęcia</span>
          </div>
        )}
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded shadow-md flex items-center">
          <span className={`font-bold ${priceColorClass}`}>{price}</span>
        </div>
      </div>
      
      <div className={`flex flex-col flex-grow p-4 ${isFullWidth ? 'border-t-0' : ''}`}>
        <h3 className={`text-lg font-semibold mb-2 ${isFullWidth ? '' : 'line-clamp-2 min-h-[3.5rem]'}`}>
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-900 transition-colors"
          >
            {highlightText(title)}
          </Link>
        </h3>
        
        <div className="flex items-center mb-2">
          <FiShoppingCart className="text-gray-500 mr-2" />
          {isFreeShipping ? (
            <span className="text-green-600 text-sm font-medium">Darmowa dostawa</span>
          ) : shippingPrice ? (
            <span className="text-sm text-gray-500">
              Dostawa: {shippingPrice}
            </span>
          ) : (
            <span className="text-sm text-gray-500">Sprawdź cenę dostawy</span>
          )}
        </div>
        
        <p className={`text-gray-600 text-sm ${isFullWidth ? '' : 'line-clamp-3'} mb-4 flex-grow`}>
          {highlightText(description)}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${accentColorClass.split(' ')[0]} ${accentColorClass.split(' ')[1]} text-sm font-medium flex items-center transition-colors`}
            aria-label={`Open ${title} deal in new tab`}
          >
            Zobacz ofertę 
            <FiExternalLink className="ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

export default ArticleCard; 