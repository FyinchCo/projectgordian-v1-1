
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { archetypeTestingFramework, TestQuestion } from "@/services/testing/archetypeTestingFramework";
import { allArchetypeSpecificQuestions } from "@/services/testing/archetypeSpecificQuestions";
import { Target, Plus, Brain, Eye, Shield, Hammer, Zap } from "lucide-react";

export const TestQuestionManager = () => {
  const [newQuestion, setNewQuestion] = useState<Partial<TestQuestion>>({
    question: '',
    domain: '',
    expectedOutcomes: [],
    difficulty: 'medium',
    category: 'philosophical',
    archetypeTarget: 'All'
  });
  const [outcomeInput, setOutcomeInput] = useState('');
  const { toast } = useToast();

  const questions = archetypeTestingFramework.getTestQuestions();

  const loadArchetypeSpecificQuestions = () => {
    allArchetypeSpecificQuestions.forEach(question => {
      if (!questions.find(q => q.id === question.id)) {
        archetypeTestingFramework.addTestQuestion(question);
      }
    });
    
    toast({
      title: "Questions Loaded",
      description: `${allArchetypeSpecificQuestions.length} archetype-specific test questions loaded.`,
    });
  };

  const addQuestion = () => {
    if (!newQuestion.question?.trim()) {
      toast({
        title: "Error",
        description: "Question text is required.",
        variant: "destructive"
      });
      return;
    }

    const question: TestQuestion = {
      id: `custom-${Date.now()}`,
      question: newQuestion.question,
      domain: newQuestion.domain || 'general',
      expectedOutcomes: newQuestion.expectedOutcomes || [],
      difficulty: newQuestion.difficulty || 'medium',
      category: newQuestion.category || 'philosophical',
      archetypeTarget: newQuestion.archetypeTarget || 'All'
    };

    archetypeTestingFramework.addTestQuestion(question);
    setNewQuestion({
      question: '',
      domain: '',
      expectedOutcomes: [],
      difficulty: 'medium',
      category: 'philosophical',
      archetypeTarget: 'All'
    });
    setOutcomeInput('');

    toast({
      title: "Question Added",
      description: "Test question has been added successfully.",
    });
  };

  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setNewQuestion(prev => ({
        ...prev,
        expectedOutcomes: [...(prev.expectedOutcomes || []), outcomeInput.trim()]
      }));
      setOutcomeInput('');
    }
  };

  const removeOutcome = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      expectedOutcomes: prev.expectedOutcomes?.filter((_, i) => i !== index) || []
    }));
  };

  const getArchetypeIcon = (archetype: string) => {
    switch (archetype) {
      case 'The Visionary': return <Eye className="w-4 h-4" />;
      case 'The Mystic': return <Brain className="w-4 h-4" />;
      case 'The Skeptic': return <Shield className="w-4 h-4" />;
      case 'The Realist': return <Hammer className="w-4 h-4" />;
      case 'The Contrarian': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const questionsByArchetype = {
    'The Visionary': questions.filter(q => q.archetypeTarget === 'The Visionary'),
    'The Mystic': questions.filter(q => q.archetypeTarget === 'The Mystic'),
    'The Skeptic': questions.filter(q => q.archetypeTarget === 'The Skeptic'),
    'The Realist': questions.filter(q => q.archetypeTarget === 'The Realist'),
    'The Contrarian': questions.filter(q => q.archetypeTarget === 'The Contrarian'),
    'Synthesis': questions.filter(q => q.archetypeTarget === 'All'),
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Question Library Management</span>
          </CardTitle>
          <CardDescription>
            Load and manage archetype-specific test questions for scientific evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={loadArchetypeSpecificQuestions} className="bg-blue-600 hover:bg-blue-700">
              Load Archetype-Specific Questions ({allArchetypeSpecificQuestions.length})
            </Button>
            <div className="text-sm text-gray-600 flex items-center">
              Current questions: {questions.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Categories */}
      <Tabs defaultValue="by-archetype" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="by-archetype">By Archetype</TabsTrigger>
          <TabsTrigger value="add-question">Add New Question</TabsTrigger>
        </TabsList>

        <TabsContent value="by-archetype" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(questionsByArchetype).map(([archetype, archetypeQuestions]) => (
              <Card key={archetype}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    {getArchetypeIcon(archetype)}
                    <span>{archetype}</span>
                    <Badge variant="secondary">{archetypeQuestions.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {archetypeQuestions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No specific questions loaded</p>
                    ) : (
                      archetypeQuestions.slice(0, 3).map(question => (
                        <div key={question.id} className="p-3 border rounded-lg">
                          <p className="text-sm font-medium mb-2">{question.question}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {archetypeQuestions.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{archetypeQuestions.length - 3} more questions...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add-question" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Test Question</CardTitle>
              <CardDescription>
                Add your own test questions to evaluate specific aspects of archetype performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Textarea
                  placeholder="Enter your test question..."
                  value={newQuestion.question || ''}
                  onChange={(e) => setNewQuestion(prev => ({...prev, question: e.target.value}))}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Domain</label>
                  <Input
                    placeholder="e.g., philosophy, technology, creativity"
                    value={newQuestion.domain || ''}
                    onChange={(e) => setNewQuestion(prev => ({...prev, domain: e.target.value}))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Archetype</label>
                  <Select 
                    value={newQuestion.archetypeTarget || 'All'} 
                    onValueChange={(value) => setNewQuestion(prev => ({...prev, archetypeTarget: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All (Synthesis Test)</SelectItem>
                      <SelectItem value="The Visionary">The Visionary</SelectItem>
                      <SelectItem value="The Mystic">The Mystic</SelectItem>
                      <SelectItem value="The Skeptic">The Skeptic</SelectItem>
                      <SelectItem value="The Realist">The Realist</SelectItem>
                      <SelectItem value="The Contrarian">The Contrarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select 
                    value={newQuestion.difficulty || 'medium'} 
                    onValueChange={(value) => setNewQuestion(prev => ({...prev, difficulty: value as any}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select 
                    value={newQuestion.category || 'philosophical'} 
                    onValueChange={(value) => setNewQuestion(prev => ({...prev, category: value as any}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="philosophical">Philosophical</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="scientific">Scientific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Expected Outcomes</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add expected outcome..."
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addOutcome()}
                  />
                  <Button type="button" onClick={addOutcome} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newQuestion.expectedOutcomes?.map((outcome, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeOutcome(index)}
                    >
                      {outcome} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={addQuestion} className="w-full">
                Add Test Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
