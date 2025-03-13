'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const colorMap = {
  primary: 'text-pepper-red',
  secondary: 'text-pepper-orange',
  white: 'text-white',
  gray: 'text-gray-500'
};

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color];

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1.2
  };

  const pulse = {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const container = fullScreen 
    ? "fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-50"
    : "flex flex-col justify-center items-center";

  return (
    <div className={container}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className={`${sizeClass} ${colorClass}`} 
        role="status"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-full h-full"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </motion.div>
      
      {text && (
        <motion.p 
          animate={pulse}
          className={`mt-3 text-sm font-medium ${colorClass}`}
        >
          {text}
        </motion.p>
      )}
      
      <span className="sr-only">Loading...</span>
    </div>
  );
});

export default LoadingSpinner; 