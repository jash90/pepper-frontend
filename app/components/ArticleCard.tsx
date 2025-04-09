'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  
  // Color class for the price tag
  const priceColorClass = categoryColor === 'pepper-red' || !categoryColor 
    ? 'text-pepper-red' 
    : `text-${categoryColor}-500`;
  
  // Calculate loading delay based on index (for staggered loading appearance)
  const loadDelay = Math.min(index * 50, 300);
  
  return (
    <div 
      className={`card flex ${isFullWidth ? 'flex-row' : 'flex-col'} h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${!isFullWidth ? 'w-full' : ''}`}
      style={{ animationDelay: `${loadDelay}ms` }}
    >
      {/* Container dla obrazka - różne proporcje dla listy i siatki */}
      <div 
        className={`
          relative overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0
          ${isFullWidth 
            ? 'w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[180px] md:h-[180px] rounded-l-lg flex-shrink-0' 
            : 'w-full aspect-square rounded-t-lg'}
        `}
      >
        {image ? (
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full"
            aria-label={`Przejdź do oferty ${title}`}
          >
            <div className="relative w-full h-full bg-gray-200 dark:bg-gray-600">
              <Image
                src={image}
                alt={title}
                fill={true}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                loading={index < 6 ? "eager" : "lazy"}
                sizes={isFullWidth 
                  ? "(max-width: 640px) 160px, 180px" 
                  : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjY2NjIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI2VlZSIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNjY2MiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWVlIiAvPgogIDxyZWN0IGlkPSJyIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9InVybCgjZykiIC8+CiAgPGFuaW1hdGUgeGxpbms6aHJlZj0iI3IiIGF0dHJpYnV0ZU5hbWU9IngiIGZyb209Ii04MCIgdG89IjgwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg=="
                unoptimized={false}
                priority={index < 2}
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          </Link>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 flex-col">
            <FiTag className="w-6 h-6 mb-1" aria-hidden="true" />
            <span className="text-xs">Brak zdjęcia</span>
          </div>
        )}
        
        {/* Price tag */}
        {price && (
          <div className="absolute top-1 right-1 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-md flex items-center z-10">
            <span className={`font-bold ${priceColorClass} ${!isFullWidth ? 'text-xs' : 'text-sm'}`}>{price}</span>
          </div>
        )}
      </div>
      
      <div className={`flex flex-col flex-grow p-2 dark:text-gray-100 ${!isFullWidth ? 'p-2' : 'p-3 sm:p-4'}`}>
        <h3 className={`${!isFullWidth ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'} font-semibold mb-1 ${isFullWidth ? 'line-clamp-1' : 'line-clamp-2'}`}>
          <Link 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white transition-colors"
          >
            {highlightText(title)}
          </Link>
        </h3>
        
        <div className={`flex items-center mb-1 ${!isFullWidth ? 'text-xs' : 'text-xs sm:text-sm'}`}>
          <FiShoppingCart className="text-gray-500 dark:text-gray-400 mr-1 flex-shrink-0 w-3 h-3" aria-hidden="true" />
          {isFreeShipping ? (
            <span className="text-green-600 dark:text-green-400 font-medium truncate text-xs">Darmowa dostawa</span>
          ) : shippingPrice ? (
            <span className="text-gray-500 dark:text-gray-400 truncate text-xs">
              Dostawa: {shippingPrice}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 truncate text-xs">Sprawdź dostawę</span>
          )}
        </div>
        
        {description && !isFullWidth ? (
          <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2 mb-2 flex-grow">
            {highlightText(description)}
          </p>
        ) : description && (
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2 flex-grow">
            {highlightText(description)}
          </p>
        )}
        
        <div className={`mt-auto pt-1 border-t border-gray-100 dark:border-gray-700`}>
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${accentColorClass.split(' ')[0]} ${accentColorClass.split(' ')[1]} text-xs font-medium flex items-center transition-colors`}
            aria-label={`Otwórz ofertę ${title} w nowej karcie`}
          >
            Zobacz ofertę 
            <FiExternalLink className="ml-1 flex-shrink-0 w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ArticleCard; 