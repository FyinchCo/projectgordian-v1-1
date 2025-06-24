
import { Card } from "@/components/ui/card";
import { Cpu, Layers, Target } from "lucide-react";

export const InfoCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
        <Cpu className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
        <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
          Dynamic Archetypes
        </h3>
        <p className="text-xs font-inter text-mono-dark-gray">
          AI-tuned personality parameters for optimal perspective diversity
        </p>
      </Card>
      
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
        <Layers className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
        <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
          Deep Processing
        </h3>
        <p className="text-xs font-inter text-mono-dark-gray">
          5-20 layers of recursive analysis with real-time visualization
        </p>
      </Card>
      
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
        <Target className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
        <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
          Refined Output
        </h3>
        <p className="text-xs font-inter text-mono-dark-gray">
          Compressed insights tailored to your chosen answer format
        </p>
      </Card>
    </div>
  );
};
