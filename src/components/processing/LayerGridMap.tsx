
import { useState } from "react";

interface LayerGridMapProps {
  currentLayer: number;
  totalLayers: number;
}

export const LayerGridMap = ({ currentLayer, totalLayers }: LayerGridMapProps) => {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  // Create grid of dots (4x5 = 20, adjust for different totals)
  const gridSize = Math.ceil(Math.sqrt(totalLayers));
  const layers = Array.from({ length: totalLayers }, (_, i) => i + 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-mono text-gray-600 uppercase tracking-wider text-center">
        Layer Progress Map
      </h3>
      
      <div 
        className="grid gap-3 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${Math.min(gridSize, 5)}, 1fr)`,
          maxWidth: '240px'
        }}
      >
        {layers.map((layer) => {
          const isCompleted = layer < currentLayer;
          const isActive = layer === currentLayer;
          const isPending = layer > currentLayer;
          
          return (
            <div
              key={layer}
              className={`
                w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer
                flex items-center justify-center text-xs font-mono
                ${isCompleted ? 'bg-black border-black text-white' :
                  isActive ? 'border-black border-2 bg-white animate-pulse shadow-lg' :
                  'border-gray-300 bg-white hover:border-gray-400'}
                ${hoveredLayer === layer ? 'scale-110 shadow-md' : ''}
              `}
              onMouseEnter={() => setHoveredLayer(layer)}
              onMouseLeave={() => setHoveredLayer(null)}
              title={`Layer ${layer} - ${isCompleted ? 'Complete' : isActive ? 'Active' : 'Pending'}`}
            >
              {isCompleted ? '✓' : layer}
              {isActive && (
                <div className="absolute w-2 h-2 bg-black rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {hoveredLayer && (
        <div className="text-center text-xs text-gray-500 font-inter">
          Layer {hoveredLayer} - {hoveredLayer < currentLayer ? 'Completed' : hoveredLayer === currentLayer ? 'Processing' : 'Pending'}
        </div>
      )}
    </div>
  );
};
