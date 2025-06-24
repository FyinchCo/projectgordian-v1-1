
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { OUTPUT_TYPE_CONFIGS, OutputType } from "@/types/outputTypes";

interface OutputTypeSelectorProps {
  selectedType: OutputType;
  onTypeChange: (type: OutputType) => void;
}

export const OutputTypeSelector = ({ selectedType, onTypeChange }: OutputTypeSelectorProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gordian-cream to-white border-gordian-beige shadow-sm">
      <div className="space-y-4">
        <h3 className="font-playfair text-lg font-medium text-gordian-dark-brown">
          Choose Your Insight Style
        </h3>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => onTypeChange(value as OutputType)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {OUTPUT_TYPE_CONFIGS.map((config) => (
            <div key={config.id} className="relative">
              <RadioGroupItem 
                value={config.id} 
                id={config.id} 
                className="peer sr-only" 
              />
              <Label 
                htmlFor={config.id}
                className="flex flex-col p-4 rounded-lg border-2 border-gordian-beige bg-white cursor-pointer transition-all duration-200 hover:border-gordian-brown hover:shadow-md peer-checked:border-gordian-dark-brown peer-checked:bg-gordian-cream peer-checked:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-playfair font-semibold text-gordian-dark-brown text-lg">
                    {config.label}
                  </span>
                  <div className="w-4 h-4 rounded-full border-2 border-gordian-brown peer-checked:bg-gordian-dark-brown peer-checked:border-gordian-dark-brown transition-colors">
                    <div className="w-full h-full rounded-full bg-gordian-dark-brown opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="font-inter text-sm text-gordian-brown leading-relaxed">
                  {config.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
};
