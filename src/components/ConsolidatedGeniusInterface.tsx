
import { Card } from "@/components/ui/card";
import { OutputType } from "@/types/outputTypes";
import { useEnhancedAIConfigOptimization } from "@/hooks/useEnhancedAIConfigOptimization";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { MetaLearningStatusCard } from "./interface/MetaLearningStatusCard";
import { AssessmentDisplay } from "./interface/AssessmentDisplay";
import { ProcessingConfigurationSection } from "./interface/ProcessingConfigurationSection";
import { LaunchSection } from "./interface/LaunchSection";
import { PixelRobot } from "./PixelRobot";

interface ConsolidatedGeniusInterfaceProps {
  question: string;
  setQuestion: (question: string) => void;
  outputType: OutputType;
  setOutputType: (type: OutputType) => void;
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
  currentAssessment: any;
  setCurrentAssessment: (assessment: any) => void;
  onStartGenius: () => void;
}

export const ConsolidatedGeniusInterface = ({
  question,
  setQuestion,
  outputType,
  setOutputType,
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes,
  currentAssessment,
  setCurrentAssessment,
  onStartGenius
}: ConsolidatedGeniusInterfaceProps) => {
  const {
    optimizationReasoning,
    clearOptimizationReasoning,
    getLearningInsights
  } = useEnhancedAIConfigOptimization();

  const learningInsights = getLearningInsights();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Charming Welcome Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <PixelRobot size={64} mood="excited" animate={true} />
          <div className="text-left">
            <h2 className="text-5xl font-bold tracking-tight text-gray-800 leading-tight">
              What's Puzzling You?
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              I love a good challenge! 🤖✨
            </p>
          </div>
          <PixelRobot size={64} mood="thinking" />
        </div>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Ask me something complex, contradictory, or just plain tricky. 
          I'll gather my AI friends and we'll brainstorm breakthrough insights together!
        </p>
        
        {customArchetypes && (
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 inline-block">
            <div className="flex items-center space-x-2">
              <PixelRobot size={24} mood="happy" />
              <span className="text-sm font-medium text-green-800">
                Using {customArchetypes.length} of your custom AI personalities
              </span>
            </div>
          </div>
        )}
        
        {enhancedMode && (
          <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 inline-block">
            <div className="flex items-center space-x-2">
              <PixelRobot size={24} mood="working" />
              <span className="text-sm font-medium text-purple-800">
                Enhanced Mode: Extra assumption-challenging power activated!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Meta-Learning Status with Robot Charm */}
      <MetaLearningStatusCard
        learningInsights={learningInsights}
        optimizationReasoning={optimizationReasoning}
        clearOptimizationReasoning={clearOptimizationReasoning}
      />

      {/* Main Question Input Card with Playful Design */}
      <Card className="border-3 border-gray-300 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
        <div className="p-8 space-y-8">
          <QuestionInputSection 
            question={question} 
            setQuestion={setQuestion} 
            outputType={outputType} 
            setOutputType={setOutputType} 
          />

          {/* Assessment Display */}
          <AssessmentDisplay 
            currentAssessment={currentAssessment}
            learningInsights={learningInsights}
          />

          {/* Configuration with Friendly Styling */}
          <ProcessingConfigurationSection
            processingDepth={processingDepth}
            setProcessingDepth={setProcessingDepth}
            circuitType={circuitType}
            setCircuitType={setCircuitType}
            enhancedMode={enhancedMode}
            setEnhancedMode={setEnhancedMode}
            customArchetypes={customArchetypes}
            learningInsights={learningInsights}
          />

          {/* Launch Button with Robot Celebration */}
          <div className="pt-8 border-t-2 border-gray-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <PixelRobot size={32} mood="excited" animate={true} />
              <span className="text-lg font-medium text-gray-700">Ready to think together?</span>
              <PixelRobot size={32} mood="celebrating" />
            </div>
            <LaunchSection 
              question={question}
              onStartGenius={onStartGenius}
            />
          </div>
        </div>
      </Card>

      {/* Charming Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <Card className="border-2 border-green-300 bg-green-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="thinking" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-green-800">Multi-Perspective Magic</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            I gather different AI personalities to look at your problem from every angle
          </p>
        </Card>
        
        <Card className="border-2 border-blue-300 bg-blue-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="working" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-blue-800">Breakthrough Insights</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            We don't just give answers - we discover breakthrough insights together
          </p>
        </Card>
        
        <Card className="border-2 border-purple-300 bg-purple-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="celebrating" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-purple-800">Friendly & Smart</h3>
          <p className="text-sm text-purple-700 leading-relaxed">
            Sophisticated AI power delivered with a smile and a helpful attitude
          </p>
        </Card>
      </div>
    </div>
  );
};
