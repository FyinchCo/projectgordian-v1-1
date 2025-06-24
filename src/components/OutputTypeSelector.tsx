
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
    <Card className="p-4 mb-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Choose your insight style:</h3>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => onTypeChange(value as OutputType)}
          className="flex flex-col space-y-2"
        >
          {OUTPUT_TYPE_CONFIGS.map((config) => (
            <div key={config.id} className="flex items-center space-x-3">
              <RadioGroupItem value={config.id} id={config.id} />
              <Label 
                htmlFor={config.id}
                className="flex-1 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-sm text-gray-600">{config.description}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
};
