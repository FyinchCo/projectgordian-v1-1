
import React from 'react';

interface PixelRobotProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'working' | 'celebrating';
  animate?: boolean;
}

export const PixelRobot = ({ 
  className = "", 
  size = 32, 
  mood = 'happy',
  animate = false 
}: PixelRobotProps) => {
  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return '#4ADE80'; // green-400
      case 'thinking': return '#60A5FA'; // blue-400
      case 'excited': return '#F472B6'; // pink-400
      case 'working': return '#FBBF24'; // yellow-400
      case 'celebrating': return '#A855F7'; // purple-500
      default: return '#4ADE80';
    }
  };

  const getEyeState = () => {
    switch (mood) {
      case 'thinking': return 'M14 12h2v2h-2zm4 0h2v2h-2z'; // focused eyes
      case 'excited': return 'M13 11h4v4h-4z'; // wide eyes
      case 'working': return 'M14 13h2v1h-2zm4 0h2v1h-2z'; // concentrated
      case 'celebrating': return 'M13 11h1v1h1v1h1v1h1v1h-1v-1h-1v-1h-1v-1h-1zm4 0h1v1h1v1h1v1h1v1h-1v-1h-1v-1h-1v-1h-1z'; // star eyes
      default: return 'M14 12h2v2h-2zm4 0h2v2h-2z'; // normal eyes
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`${className} ${animate ? 'animate-bounce' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Robot body */}
      <rect x="8" y="6" width="16" height="20" fill={getMoodColor()} />
      <rect x="6" y="8" width="20" height="16" fill={getMoodColor()} />
      
      {/* Head outline */}
      <rect x="10" y="8" width="12" height="8" fill="#1F2937" />
      <rect x="8" y="10" width="16" height="4" fill="#1F2937" />
      
      {/* Screen/face */}
      <rect x="11" y="9" width="10" height="6" fill="#0F172A" />
      
      {/* Eyes */}
      <g fill="#22D3EE">
        <path d={getEyeState()} />
      </g>
      
      {/* Antenna */}
      <rect x="15" y="4" width="2" height="4" fill="#374151" />
      <rect x="14" y="3" width="4" height="2" fill="#EF4444" />
      
      {/* Arms */}
      <rect x="4" y="12" width="4" height="6" fill={getMoodColor()} />
      <rect x="24" y="12" width="4" height="6" fill={getMoodColor()} />
      
      {/* Hands */}
      <rect x="2" y="14" width="2" height="2" fill="#374151" />
      <rect x="28" y="14" width="2" height="2" fill="#374151" />
      
      {/* Legs */}
      <rect x="11" y="26" width="3" height="4" fill={getMoodColor()} />
      <rect x="18" y="26" width="3" height="4" fill={getMoodColor()} />
      
      {/* Feet */}
      <rect x="9" y="30" width="7" height="2" fill="#374151" />
      <rect x="16" y="30" width="7" height="2" fill="#374151" />
      
      {/* Chest panel */}
      <rect x="13" y="18" width="6" height="4" fill="#0F172A" />
      <rect x="14" y="19" width="4" height="2" fill="#22D3EE" />
    </svg>
  );
};
