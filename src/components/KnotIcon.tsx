
import React from 'react';

interface KnotIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const KnotIcon = ({ className = "", size = 32, animate = false }: KnotIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animate ? 'animate-pulse-slow' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brutal geometric knot structure */}
      <path
        d="M20 20 L35 35 L50 20 L65 35 L80 20 L80 35 L65 50 L80 65 L80 80 L65 65 L50 80 L35 65 L20 80 L20 65 L35 50 L20 35 Z"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      
      {/* Inner contradiction lines */}
      <path
        d="M35 35 L65 65 M65 35 L35 65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      
      {/* Central void - the "cut" */}
      <rect 
        x="45" 
        y="45" 
        width="10" 
        height="10" 
        fill="currentColor"
        transform="rotate(45 50 50)"
      />
      
      {/* Corner emphasis dots */}
      <rect x="18" y="18" width="4" height="4" fill="currentColor" />
      <rect x="78" y="18" width="4" height="4" fill="currentColor" />
      <rect x="78" y="78" width="4" height="4" fill="currentColor" />
      <rect x="18" y="78" width="4" height="4" fill="currentColor" />
    </svg>
  );
};
