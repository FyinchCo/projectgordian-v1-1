
import React from 'react';

interface PixelRobotFrogProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const PixelRobotFrog = ({ 
  className = "", 
  size = 64, 
  animate = false 
}: PixelRobotFrogProps) => {
  const scale = size / 64; // Base size is 64x64

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className} ${animate ? 'animate-bounce' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Red antenna */}
      <rect x="30" y="4" width="4" height="4" fill="#FF0000" />
      
      {/* Black antenna base */}
      <rect x="30" y="8" width="4" height="4" fill="#000000" />
      
      {/* Main body outline - black */}
      <rect x="8" y="12" width="48" height="32" fill="#000000" />
      <rect x="12" y="8" width="40" height="8" fill="#000000" />
      <rect x="4" y="16" width="8" height="24" fill="#000000" />
      <rect x="52" y="16" width="8" height="24" fill="#000000" />
      <rect x="8" y="44" width="48" height="8" fill="#000000" />
      
      {/* Inner body - gray */}
      <rect x="12" y="16" width="40" height="24" fill="#808080" />
      <rect x="16" y="12" width="32" height="8" fill="#808080" />
      <rect x="8" y="20" width="8" height="16" fill="#808080" />
      <rect x="48" y="20" width="8" height="16" fill="#808080" />
      <rect x="12" y="40" width="40" height="4" fill="#808080" />
      
      {/* Screen/face area - darker gray */}
      <rect x="16" y="16" width="32" height="20" fill="#404040" />
      
      {/* Left eye - red pixelated */}
      <rect x="20" y="20" width="8" height="8" fill="#FF0000" />
      <rect x="22" y="18" width="4" height="2" fill="#FF0000" />
      <rect x="22" y="30" width="4" height="2" fill="#FF0000" />
      <rect x="18" y="22" width="2" height="4" fill="#FF0000" />
      <rect x="30" y="22" width="2" height="4" fill="#FF0000" />
      
      {/* Left eye inner details */}
      <rect x="22" y="22" width="4" height="4" fill="#FFFFFF" />
      <rect x="24" y="20" width="2" height="2" fill="#FFB3B3" />
      <rect x="20" y="24" width="2" height="2" fill="#FFB3B3" />
      <rect x="28" y="24" width="2" height="2" fill="#FFB3B3" />
      <rect x="24" y="28" width="2" height="2" fill="#FFB3B3" />
      
      {/* Right eye - red pixelated */}
      <rect x="36" y="20" width="8" height="8" fill="#FF0000" />
      <rect x="38" y="18" width="4" height="2" fill="#FF0000" />
      <rect x="38" y="30" width="4" height="2" fill="#FF0000" />
      <rect x="34" y="22" width="2" height="4" fill="#FF0000" />
      <rect x="46" y="22" width="2" height="4" fill="#FF0000" />
      
      {/* Right eye inner details */}
      <rect x="38" y="22" width="4" height="4" fill="#FFFFFF" />
      <rect x="40" y="20" width="2" height="2" fill="#FFB3B3" />
      <rect x="36" y="24" width="2" height="2" fill="#FFB3B3" />
      <rect x="44" y="24" width="2" height="2" fill="#FFB3B3" />
      <rect x="40" y="28" width="2" height="2" fill="#FFB3B3" />
      
      {/* Checkered pattern mouth */}
      <rect x="20" y="32" width="2" height="2" fill="#000000" />
      <rect x="24" y="32" width="2" height="2" fill="#000000" />
      <rect x="28" y="32" width="2" height="2" fill="#000000" />
      <rect x="32" y="32" width="2" height="2" fill="#000000" />
      <rect x="36" y="32" width="2" height="2" fill="#000000" />
      <rect x="40" y="32" width="2" height="2" fill="#000000" />
      <rect x="44" y="32" width="2" height="2" fill="#000000" />
      
      <rect x="22" y="32" width="2" height="2" fill="#FFFFFF" />
      <rect x="26" y="32" width="2" height="2" fill="#FFFFFF" />
      <rect x="30" y="32" width="2" height="2" fill="#FFFFFF" />
      <rect x="34" y="32" width="2" height="2" fill="#FFFFFF" />
      <rect x="38" y="32" width="2" height="2" fill="#FFFFFF" />
      <rect x="42" y="32" width="2" height="2" fill="#FFFFFF" />
      
      <rect x="20" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="24" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="28" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="32" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="36" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="40" y="34" width="2" height="2" fill="#FFFFFF" />
      <rect x="44" y="34" width="2" height="2" fill="#FFFFFF" />
      
      <rect x="22" y="34" width="2" height="2" fill="#000000" />
      <rect x="26" y="34" width="2" height="2" fill="#000000" />
      <rect x="30" y="34" width="2" height="2" fill="#000000" />
      <rect x="34" y="34" width="2" height="2" fill="#000000" />
      <rect x="38" y="34" width="2" height="2" fill="#000000" />
      <rect x="42" y="34" width="2" height="2" fill="#000000" />
      
      {/* Side panels */}
      <rect x="52" y="20" width="4" height="12" fill="#B3B3B3" />
      <rect x="8" y="20" width="4" height="12" fill="#B3B3B3" />
      
      {/* Bottom details */}
      <rect x="16" y="44" width="4" height="4" fill="#404040" />
      <rect x="24" y="44" width="4" height="4" fill="#404040" />
      <rect x="32" y="44" width="4" height="4" fill="#404040" />
      <rect x="40" y="44" width="4" height="4" fill="#404040" />
      
      {/* Arms */}
      <rect x="0" y="24" width="8" height="8" fill="#808080" />
      <rect x="56" y="24" width="8" height="8" fill="#808080" />
      <rect x="2" y="26" width="4" height="4" fill="#404040" />
      <rect x="58" y="26" width="4" height="4" fill="#404040" />
      
      {/* Legs */}
      <rect x="20" y="52" width="6" height="8" fill="#808080" />
      <rect x="38" y="52" width="6" height="8" fill="#808080" />
      <rect x="22" y="54" width="2" height="4" fill="#404040" />
      <rect x="40" y="54" width="2" height="4" fill="#404040" />
      
      {/* Feet */}
      <rect x="16" y="60" width="14" height="4" fill="#000000" />
      <rect x="34" y="60" width="14" height="4" fill="#000000" />
      <rect x="18" y="58" width="10" height="2" fill="#000000" />
      <rect x="36" y="58" width="10" height="2" fill="#000000" />
    </svg>
  );
};
