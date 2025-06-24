
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

export type InsightFormat = 'ultra' | 'medium' | 'comprehensive';

interface InsightFormatToggleProps {
  currentFormat: InsightFormat;
  onFormatChange: (format: InsightFormat) => void;
}

export const InsightFormatToggle = ({ currentFormat, onFormatChange }: InsightFormatToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <div className="text-sm text-gray-500 uppercase tracking-wide">Format:</div>
      <ToggleGroup
        type="single"
        value={currentFormat}
        onValueChange={(value) => value && onFormatChange(value as InsightFormat)}
        className="bg-gray-50 rounded-lg p-1"
      >
        <ToggleGroupItem 
          value="ultra" 
          className="data-[state=on]:bg-blue-500 data-[state=on]:text-white transition-all"
        >
          <div className="flex items-center space-x-1">
            <span>Ultra</span>
            <Badge variant="secondary" className="text-xs">2-3 words</Badge>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="medium" 
          className="data-[state=on]:bg-green-500 data-[state=on]:text-white transition-all"
        >
          <div className="flex items-center space-x-1">
            <span>Medium</span>
            <Badge variant="secondary" className="text-xs">Balanced</Badge>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="comprehensive" 
          className="data-[state=on]:bg-purple-500 data-[state=on]:text-white transition-all"
        >
          <div className="flex items-center space-x-1">
            <span>Full</span>
            <Badge variant="secondary" className="text-xs">Extended</Badge>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
