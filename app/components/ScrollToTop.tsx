'use client';

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { FiArrowUp } from 'react-icons/fi';

interface ScrollToTopProps {
  threshold?: number;
  position?: 'right' | 'left';
  offset?: number;
}

const ScrollToTop = memo(function ScrollToTop({
  threshold = 300,
  position = 'right',
  offset = 6,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isRunningRef = useRef(false);

  // Uproszczona wersja throttle - bez dodatkowej biblioteki
  const toggleVisibility = useCallback(() => {
    // Używamy requestAnimationFrame zamiast throttle
    // dla lepszej wydajności
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      
      window.requestAnimationFrame(() => {
        if (window.scrollY > threshold) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        isRunningRef.current = false;
      });
    }
  }, [threshold]);

  // Pasywne nasłuchiwanie zdarzeń scroll - mniejsze obciążenie procesora
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  // Przewijanie do góry strony
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Style pozycji - obliczone raz
  const buttonStyle = {
    ...(position === 'right' ? { right: `${offset}rem` } : { left: `${offset}rem` }),
    position: 'fixed',
    bottom: '1.5rem',
    zIndex: 50,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    pointerEvents: isVisible ? 'auto' : 'none'
  };

  if (!isVisible) {
    return null; // Nie renderuj niczego, gdy przycisk nie jest widoczny
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Przewiń do góry"
      style={buttonStyle as React.CSSProperties}
      className="p-3 rounded-full bg-pepper-red text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pepper-red hover:bg-opacity-90 active:transform active:scale-95"
    >
      <FiArrowUp className="h-6 w-6" aria-hidden="true" />
    </button>
  );
});

export default ScrollToTop; 