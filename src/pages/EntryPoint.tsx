
import { useNavigate } from "react-router-dom";
import { KnotIcon } from "@/components/KnotIcon";

const EntryPoint = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mono-pure-white flex items-center justify-center">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <KnotIcon className="text-mono-pure-black" size={24} animate />
            <h1 className="text-4xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase">
              PROJECT GORDIAN
            </h1>
          </div>
          
          <div className="text-mono-pure-black text-2xl">—</div>
          
          <p className="text-lg font-inter text-mono-medium-gray max-w-md mx-auto">
            AI's Recursive Distillation of a Knot
          </p>
        </div>

        <button
          onClick={() => navigate("/question-type")}
          className="text-lg font-inter text-mono-pure-black hover:text-mono-charcoal transition-colors cursor-pointer"
        >
          → Start Your Deep Inquiry
        </button>
      </div>
    </div>
  );
};

export default EntryPoint;
