'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { throttle } from 'lodash';

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

  // Throttle the scroll event to improve performance
  const toggleVisibility = useCallback(
    throttle(() => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 200),
    [threshold]
  );

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  // Scroll to top smoothly
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Position styles
  const positionStyle = position === 'right'
    ? { right: `${offset}rem` }
    : { left: `${offset}rem` };

  // Animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.1,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          onClick={scrollToTop}
          aria-label="Przewiń do góry"
          style={positionStyle}
          className={`fixed bottom-6 p-3 rounded-full bg-pepper-red text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pepper-red z-50 transition-colors duration-300`}
        >
          <FiArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

export default ScrollToTop; 