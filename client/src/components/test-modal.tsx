import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { TestCategory, TestQuestion, TestResult } from "@shared/schema";

interface TestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  testCategory: TestCategory;
}

export default function TestModal({ isOpen, onOpenChange, testCategory }: TestModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(testCategory.duration * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery<TestQuestion[]>({
    queryKey: [`/api/test-categories/${testCategory.id}/questions`],
    enabled: isOpen
  });

  const submitTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const response = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      });
      
      if (!response.ok) throw new Error("Failed to submit test");
      return response.json();
    },
    onSuccess: (data) => {
      setTestResult(data);
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/test-results"] });
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your test. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSelectedAnswer("");
      setTimeLeft(testCategory.duration * 60);
      setIsSubmitted(false);
      setTestResult(null);
    }
  }, [isOpen, testCategory]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Save current answer
    const newAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
    setAnswers(newAnswers);

    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      handleSubmitTest(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleSubmitTest = (finalAnswers = answers) => {
    if (!questions) return;

    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const testData = {
      categoryId: testCategory.id,
      score: correctCount,
      totalQuestions: questions.length,
      answers: finalAnswers,
      feedback: generateFeedback(correctCount, questions.length)
    };

    submitTestMutation.mutate(testData);
  };

  const generateFeedback = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) {
      return "Excellent work! You have a strong understanding of communication skills. Keep practicing to maintain this level.";
    } else if (percentage >= 80) {
      return "Good job! You have a solid foundation in communication skills. Focus on the areas where you missed questions.";
    } else if (percentage >= 70) {
      return "Fair performance. You understand the basics but should review key concepts and practice more.";
    } else {
      return "You may benefit from additional study and practice. Consider reviewing the related articles and taking the test again.";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 80) return "Good Job!";
    if (percentage >= 70) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading test questions...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isSubmitted && testResult) {
    const percentage = Math.round((testResult.score / testResult.totalQuestions) * 100);
    
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Results - {testCategory.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>
                {percentage}%
              </div>
              <div className="text-xl text-gray-600 mb-4">
                {getScoreMessage(percentage)}
              </div>
              <div className="text-gray-500">
                {testResult.score} out of {testResult.totalQuestions} questions correct
              </div>
            </div>

            {/* Feedback */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Personalized Feedback
                </h3>
                <p className="text-gray-700">{testResult.feedback}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                <i className="fas fa-check mr-2"></i>
                Continue Learning
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsSubmitted(false);
                  setTestResult(null);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setSelectedAnswer("");
                  setTimeLeft(testCategory.duration * 60);
                }}
              >
                <i className="fas fa-redo mr-2"></i>
                Retake Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Test Header */}
        <DialogHeader className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {testCategory.name}
              </DialogTitle>
              <p className="text-gray-600">Answer all questions to receive your personalized feedback</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">Time Left</div>
            </div>
          </div>
        </DialogHeader>

        {/* Test Content */}
        <div className="space-y-8">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions?.length || 0}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          {currentQuestion && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>
              
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={submitTestMutation.isPending}
              className="bg-primary hover:bg-blue-700"
            >
              {questions && currentQuestionIndex === questions.length - 1 ? (
                <>
                  {submitTestMutation.isPending ? "Submitting..." : "Submit Test"}
                  <i className="fas fa-check ml-2"></i>
                </>
              ) : (
                <>
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
