
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
      className={`${className} ${animate ? 'animate-knot-rotate' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main knot structure - interconnected loops */}
      <path
        d="M25 25 Q40 10, 55 25 Q70 40, 55 55 Q40 70, 25 55 Q10 40, 25 25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 25 Q60 10, 75 25 Q90 40, 75 55 Q60 70, 45 55 Q30 40, 45 25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 45 Q50 30, 65 45 Q80 60, 65 75 Q50 90, 35 75 Q20 60, 35 45"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Intersection points for depth */}
      <circle cx="42" cy="35" r="2" fill="currentColor" />
      <circle cx="58" cy="50" r="2" fill="currentColor" />
      <circle cx="42" cy="65" r="2" fill="currentColor" />
      <circle cx="58" cy="35" r="2" fill="currentColor" />
    </svg>
  );
};
