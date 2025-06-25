
import { Card } from "@/components/ui/card";
import { OutputType } from "@/types/outputTypes";
import { useEnhancedAIConfigOptimization } from "@/hooks/useEnhancedAIConfigOptimization";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { MetaLearningStatusCard } from "./interface/MetaLearningStatusCard";
import { AssessmentDisplay } from "./interface/AssessmentDisplay";
import { ProcessingConfigurationSection } from "./interface/ProcessingConfigurationSection";
import { LaunchSection } from "./interface/LaunchSection";
import { KnotIcon } from "./KnotIcon";

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
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Philosophical Welcome Section */}
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center space-x-6 mb-8">
          <KnotIcon size={48} className="text-zen-charcoal" animate={true} />
          <div>
            <h2 className="text-zen-heading text-4xl font-light text-zen-ink leading-tight mb-2">
              Unravel Complex Questions
            </h2>
            <p className="text-zen-body text-lg text-zen-medium">
              Where contradictions become clarity
            </p>
          </div>
          <KnotIcon size={48} className="text-zen-charcoal" />
        </div>
        
        <p className="text-zen-body text-lg text-zen-charcoal max-w-2xl mx-auto leading-relaxed">
          Present your most complex questions—those that resist simple answers. 
          Our multi-perspective analysis transforms intellectual knots into breakthrough insights.
        </p>
        
        {customArchetypes && (
          <div className="bg-zen-whisper border border-zen-light rounded-md p-4 inline-block">
            <span className="text-zen-mono text-sm text-zen-charcoal">
              {customArchetypes.length} custom perspectives integrated
            </span>
          </div>
        )}
        
        {enhancedMode && (
          <div className="bg-zen-whisper border border-zen-light rounded-md p-4 inline-block">
            <span className="text-zen-mono text-sm text-zen-charcoal">
              Enhanced assumption-challenging mode active
            </span>
          </div>
        )}
      </div>

      {/* Meta-Learning Status */}
      <MetaLearningStatusCard
        learningInsights={learningInsights}
        optimizationReasoning={optimizationReasoning}
        clearOptimizationReasoning={clearOptimizationReasoning}
      />

      {/* Main Question Input Card */}
      <Card className="border border-zen-light bg-zen-paper shadow-zen-lg">
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

          {/* Configuration */}
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

          {/* Launch Section */}
          <div className="pt-8 border-t border-zen-light">
            <LaunchSection 
              question={question}
              onStartGenius={onStartGenius}
            />
          </div>
        </div>
      </Card>

      {/* Sophisticated Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <Card className="border border-zen-light bg-zen-paper p-8 text-center shadow-zen hover:shadow-zen-lg transition-all duration-300">
          <div className="flex justify-center mb-6">
            <KnotIcon size={32} className="text-zen-charcoal" />
          </div>
          <h3 className="text-zen-heading text-xl font-light mb-4 text-zen-ink">Multi-Perspective Analysis</h3>
          <p className="text-zen-body text-sm text-zen-medium leading-relaxed">
            Multiple AI archetypes examine your question from distinct philosophical and analytical viewpoints
          </p>
        </Card>
        
        <Card className="border border-zen-light bg-zen-paper p-8 text-center shadow-zen hover:shadow-zen-lg transition-all duration-300">
          <div className="flex justify-center mb-6">
            <KnotIcon size={32} className="text-zen-charcoal" />
          </div>
          <h3 className="text-zen-heading text-xl font-light mb-4 text-zen-ink">Breakthrough Synthesis</h3>
          <p className="text-zen-body text-sm text-zen-medium leading-relaxed">
            Contradictory perspectives are synthesized into novel insights that transcend initial assumptions
          </p>
        </Card>
        
        <Card className="border border-zen-light bg-zen-paper p-8 text-center shadow-zen hover:shadow-zen-lg transition-all duration-300">
          <div className="flex justify-center mb-6">
            <KnotIcon size={32} className="text-zen-charcoal" />
          </div>
          <h3 className="text-zen-heading text-xl font-light mb-4 text-zen-ink">Intellectual Precision</h3>
          <p className="text-zen-body text-sm text-zen-medium leading-relaxed">
            Rigorous analysis combined with creative insight to address the most challenging questions
          </p>
        </Card>
      </div>
    </div>
  );
};
