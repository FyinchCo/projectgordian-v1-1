
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { Play, Pause, RotateCcw } from "lucide-react";

export const TestRunner = () => {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentTest, setCurrentTest] = useState<string>("");
  const { toast } = useToast();

  const configurations = archetypeTestingFramework.getConfigurations();
  const questions = archetypeTestingFramework.getTestQuestions();

  const handleConfigToggle = (configId: string, checked: boolean) => {
    if (checked) {
      setSelectedConfigs([...selectedConfigs, configId]);
    } else {
      setSelectedConfigs(selectedConfigs.filter(id => id !== configId));
    }
  };

  const handleQuestionToggle = (questionId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuestions([...selectedQuestions, questionId]);
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    }
  };

  const selectAllConfigs = () => {
    setSelectedConfigs(configurations.map(c => c.id));
  };

  const selectAllQuestions = () => {
    setSelectedQuestions(questions.map(q => q.id));
  };

  const clearSelections = () => {
    setSelectedConfigs([]);
    setSelectedQuestions([]);
  };

  const runBatchTest = async () => {
    if (selectedConfigs.length === 0 || selectedQuestions.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one configuration and one question.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    const totalTests = selectedConfigs.length * selectedQuestions.length;
    setProgress({ current: 0, total: totalTests });

    try {
      await archetypeTestingFramework.runBatchTest(
        selectedConfigs,
        selectedQuestions,
        (current, total) => {
          setProgress({ current, total });
          const currentConfig = configurations.find(c => c.id === selectedConfigs[Math.floor((current - 1) / selectedQuestions.length)]);
          const currentQuestion = questions.find(q => q.id === selectedQuestions[(current - 1) % selectedQuestions.length]);
          setCurrentTest(`${currentConfig?.name} × ${currentQuestion?.question.substring(0, 50)}...`);
        }
      );

      toast({
        title: "Batch Test Complete",
        description: `Successfully completed ${totalTests} tests.`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Some tests may have failed. Check the results for details.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentTest("");
    }
  };

  const runSingleTest = async (configId: string, questionId: string) => {
    try {
      setIsRunning(true);
      setCurrentTest("Running single test...");
      
      await archetypeTestingFramework.runTest(configId, questionId);
      
      toast({
        title: "Test Complete",
        description: "Single test completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Single test failed to complete.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentTest("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Batch Testing</span>
          </CardTitle>
          <CardDescription>
            Run systematic tests across multiple configurations and questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Select Configurations</h4>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllConfigs}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelections}>
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {configurations.map(config => {
                const performance = archetypeTestingFramework.getConfigurationPerformance(config.id);
                return (
                  <div key={config.id} className="flex items-start space-x-3 p-3 border rounded">
                    <Checkbox
                      checked={selectedConfigs.includes(config.id)}
                      onCheckedChange={(checked) => handleConfigToggle(config.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{config.name}</h5>
                        {performance.testCount > 0 && (
                          <Badge variant="outline">
                            {performance.averageScore.toFixed(1)}/10
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                      {performance.strengths.length > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          Strengths: {performance.strengths.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Select Test Questions</h4>
              <Button variant="outline" size="sm" onClick={selectAllQuestions}>
                Select All Questions
              </Button>
            </div>
            <div className="space-y-2">
              {questions.map(question => (
                <div key={question.id} className="flex items-start space-x-3 p-3 border rounded">
                  <Checkbox
                    checked={selectedQuestions.includes(question.id)}
                    onCheckedChange={(checked) => handleQuestionToggle(question.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{question.question}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expected: {question.expectedOutcomes.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress and Controls */}
          {isRunning && (
            <div className="space-y-3">
              <Progress value={(progress.current / progress.total) * 100} />
              <div className="text-sm text-gray-600">
                Progress: {progress.current}/{progress.total} tests
              </div>
              {currentTest && (
                <div className="text-sm text-blue-600">
                  Current: {currentTest}
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={runBatchTest} 
              disabled={isRunning || selectedConfigs.length === 0 || selectedQuestions.length === 0}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Batch Test ({selectedConfigs.length} × {selectedQuestions.length} = {selectedConfigs.length * selectedQuestions.length} tests)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Single Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Single Tests</CardTitle>
          <CardDescription>
            Run individual tests for quick validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Configuration</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select configuration" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map(config => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Question</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select question" />
                </SelectTrigger>
                <SelectContent>
                  {questions.map(question => (
                    <SelectItem key={question.id} value={question.id}>
                      {question.question.substring(0, 60)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" variant="outline" disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />
            Run Single Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
