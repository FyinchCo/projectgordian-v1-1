
import { useState, useEffect } from "react";
import { metaLearningEngine } from "@/services/learning/metaLearningEngine";
import { useToast } from "./use-toast";

export const useMetaLearning = () => {
  const [isLearning, setIsLearning] = useState(false);
  const [learningDashboard, setLearningDashboard] = useState<any>(null);
  const { toast } = useToast();

  // Load dashboard data on mount
  useEffect(() => {
    try {
      const dashboard = metaLearningEngine.getLearningDashboard();
      setLearningDashboard(dashboard);
    } catch (error) {
      console.warn('Could not load learning dashboard:', error);
    }
  }, []);

  const generateMetaOptimizedConfig = async (
    question: string,
    baseAssessment: any,
    fallbackConfig: any
  ) => {
    setIsLearning(true);
    
    try {
      const optimizedConfig = await metaLearningEngine.generateOptimizedConfiguration(
        question,
        baseAssessment,
        fallbackConfig
      );
      
      console.log('Meta-learning optimization result:', optimizedConfig);
      
      // Show learning insights to user
      if (optimizedConfig.confidence > 0.7) {
        toast({
          title: "Meta-Learning Optimization",
          description: `High-confidence optimization applied (${Math.round(optimizedConfig.confidence * 100)}% confidence). Expected ${Math.round(optimizedConfig.expectedImprovement * 10) / 10}pt improvement.`,
          variant: "default",
        });
      } else if (optimizedConfig.confidence > 0.4) {
        toast({
          title: "Learning-Enhanced Configuration",
          description: `Applied learned optimizations with moderate confidence. System is still learning your preferences.`,
          variant: "default",
        });
      }
      
      return optimizedConfig;
    } catch (error) {
      console.error('Meta-learning error:', error);
      toast({
        title: "Learning System Unavailable",
        description: "Falling back to standard optimization. Learning will resume automatically.",
        variant: "default",
      });
      return null;
    } finally {
      setIsLearning(false);
    }
  };

  const recordProcessingResults = (
    question: string,
    assessment: any,
    configuration: any,
    results: any,
    qualityMetrics: any
  ) => {
    try {
      metaLearningEngine.recordLearningCycle(
        question,
        assessment,
        configuration,
        results,
        qualityMetrics
      );
      
      // Update dashboard
      const newDashboard = metaLearningEngine.getLearningDashboard();
      setLearningDashboard(newDashboard);
      
      console.log('Learning cycle recorded successfully');
    } catch (error) {
      console.warn('Could not record learning cycle:', error);
    }
  };

  const getLearningInsights = () => {
    if (!learningDashboard) return null;
    
    const { learningStats, systemEvolution } = learningDashboard;
    
    return {
      isSystemLearning: learningStats.totalRecords > 0,
      maturityLevel: systemEvolution.maturity,
      qualityTrend: systemEvolution.qualityTrend,
      totalExperience: learningStats.totalRecords,
      averageQuality: learningStats.averageQuality,
      bestPerformingDomains: learningStats.bestDomains?.slice(0, 3) || [],
      isImproving: learningStats.improvementTrend > 0,
      learningVelocity: systemEvolution.learningVelocity
    };
  };

  const resetLearningSystem = () => {
    try {
      localStorage.removeItem('genius-machine-learning-db');
      setLearningDashboard(null);
      
      toast({
        title: "Learning System Reset",
        description: "All learning data cleared. System will start fresh with next question.",
        variant: "default",
      });
    } catch (error) {
      console.error('Could not reset learning system:', error);
    }
  };

  return {
    generateMetaOptimizedConfig,
    recordProcessingResults,
    getLearningInsights,
    resetLearningSystem,
    isLearning,
    learningDashboard
  };
};
