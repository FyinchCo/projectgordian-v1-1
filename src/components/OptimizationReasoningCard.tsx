
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Brain } from "lucide-react";

interface OptimizationReasoningCardProps {
  reasoning: string;
  domainType: string;
  onDismiss: () => void;
}

export const OptimizationReasoningCard = ({
  reasoning,
  domainType,
  onDismiss
}: OptimizationReasoningCardProps) => {
  return (
    <Card className="border border-zen-light bg-zen-whisper shadow-zen-lg rounded-md animate-fade-in">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-zen-charcoal mt-1 flex-shrink-0" />
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink">
                  Configuration Optimized
                </h3>
                <Badge className="text-xs bg-zen-light text-zen-charcoal border-zen-medium">
                  {domainType}
                </Badge>
              </div>
              <p className="text-zen-body text-sm text-zen-charcoal leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="text-zen-medium hover:text-zen-charcoal hover:bg-zen-light transition-all duration-300 p-2 rounded-sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
