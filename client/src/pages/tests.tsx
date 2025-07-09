import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TestModal from "@/components/test-modal";
import type { TestCategory, TestResult } from "@shared/schema";

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState<TestCategory | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const { data: testCategories, isLoading } = useQuery<TestCategory[]>({
    queryKey: ["/api/test-categories"],
  });

  const { data: testHistory } = useQuery<TestResult[]>({
    queryKey: ["/api/test-results"],
  });

  const handleStartTest = (category: TestCategory) => {
    setSelectedTest(category);
    setIsTestModalOpen(true);
  };

  const getColorClasses = (colorClass: string) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      "bg-blue-500": { bg: "bg-blue-500", text: "text-blue-500", hover: "hover:bg-blue-600" },
      "bg-purple-500": { bg: "bg-purple-500", text: "text-purple-500", hover: "hover:bg-purple-600" },
      "bg-green-500": { bg: "bg-green-500", text: "text-green-500", hover: "hover:bg-green-600" },
      "bg-yellow-500": { bg: "bg-yellow-500", text: "text-yellow-500", hover: "hover:bg-yellow-600" },
      "bg-red-500": { bg: "bg-red-500", text: "text-red-500", hover: "hover:bg-red-600" },
      "bg-pink-500": { bg: "bg-pink-500", text: "text-pink-500", hover: "hover:bg-pink-600" },
    };
    return colorMap[colorClass] || { bg: "bg-gray-500", text: "text-gray-500", hover: "hover:bg-gray-600" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true';

  if (isLoggedIn) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Communication Skill Tests</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evaluate your communication abilities with AI-powered assessments and receive personalized feedback
          </p>
        </div>

        {/* Test Categories */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-8">
                <CardContent className="p-0">
                  <Skeleton className="w-16 h-16 rounded-full mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="flex justify-between mb-6">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : testCategories && testCategories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testCategories.map((category) => {
              const colors = getColorClasses(category.color);
              return (
                <Card key={category.id} className="card-hover">
                  <CardContent className="p-8">
                    <div className={`${colors.bg} text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                      <i className={`${category.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-clock mr-1"></i>
                        <span>{category.duration} minutes</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-question-circle mr-1"></i>
                        <span>{category.questionCount} questions</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full ${colors.bg} text-white ${colors.hover} transition-colors btn-enhanced`}
                      onClick={() => handleStartTest(category)}
                    >
                      Start Test
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-clipboard-list text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests available</h3>
            <p className="text-gray-600">Test categories will appear here when available.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center mt-6">
          {isLoggedIn && (
            <>
              <Button onClick={() => setIsCategoryModalOpen(true)} className="btn-primary">
                <i className="fas fa-plus mr-2"></i> Add Test Category
              </Button>
              <Button onClick={() => setIsQuestionModalOpen(true)} className="btn-secondary">
                <i className="fas fa-plus mr-2"></i> Add Test Question
              </Button>
              <Button onClick={() => setIsManagementModalOpen(true)} className="btn-outline">
                <i className="fas fa-cog mr-2"></i> Manage Tests
              </Button>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Communication Skill Tests</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evaluate your communication abilities with AI-powered assessments and receive personalized feedback
          </p>
        </div>

        {/* Test Categories */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-8">
                <CardContent className="p-0">
                  <Skeleton className="w-16 h-16 rounded-full mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="flex justify-between mb-6">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : testCategories && testCategories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testCategories.map((category) => {
              const colors = getColorClasses(category.color);
              return (
                <Card key={category.id} className="card-hover">
                  <CardContent className="p-8">
                    <div className={`${colors.bg} text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                      <i className={`${category.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-clock mr-1"></i>
                        <span>{category.duration} minutes</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-question-circle mr-1"></i>
                        <span>{category.questionCount} questions</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full ${colors.bg} text-white ${colors.hover} transition-colors btn-enhanced`}
                      onClick={() => handleStartTest(category)}
                    >
                      Start Test
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-clipboard-list text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests available</h3>
            <p className="text-gray-600">Test categories will appear here when available.</p>
          </div>
        )}

        {/* Test History Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Test History</h2>
            {testHistory && testHistory.length > 0 ? (
              <div className="space-y-4">
                {testHistory.map((result) => {
                  const category = testCategories?.find(cat => cat.id === result.categoryId);
                  const colors = category ? getColorClasses(category.color) : { bg: "bg-gray-500", text: "text-gray-500" };
                  
                  return (
                    <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`${colors.bg} text-white p-3 rounded-full`}>
                          <i className={category?.icon || "fas fa-question"}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category?.name || "Unknown Test"}</h3>
                          <p className="text-sm text-gray-500">Completed {formatDate(result.completedAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(Math.round((result.score / result.totalQuestions) * 100))}`}>
                          {Math.round((result.score / result.totalQuestions) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">Score</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-history text-3xl"></i>
                </div>
                <p className="text-gray-600">No test history available. Take your first test to see results here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {selectedTest && (
        <TestModal
          isOpen={isTestModalOpen}
          onOpenChange={setIsTestModalOpen}
          testCategory={selectedTest}
        />
      )}
    </>
  );
}
