import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TestModal from "@/components/test-modal";
import { apiClient } from "@/lib/api";
import type { TestCategory, TestResult } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import IconSelector from '../components/IconSelector';

// Simple Modal Component
function SimpleModal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{title}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Category Form Component
function CategoryForm({ onSave, onCancel }: {
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 10,
    questionCount: 5,
    color: 'bg-blue-500',
    icon: 'fas fa-question'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (formData.duration < 1 || formData.duration > 60) {
      alert('Duration must be between 1 and 60 minutes');
      return;
    }
    
    if (formData.questionCount < 1 || formData.questionCount > 50) {
      alert('Question count must be between 1 and 50');
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Category Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Active Listening"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this test covers..."
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            min="1"
            max="60"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Question Count *
          </label>
          <input
            type="number"
            value={formData.questionCount}
            onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
            min="1"
            max="50"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Color Theme *
        </label>
        <select
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          <option value="bg-blue-500">Blue</option>
          <option value="bg-green-500">Green</option>
          <option value="bg-purple-500">Purple</option>
          <option value="bg-yellow-500">Yellow</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-pink-500">Pink</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Icon (choose one) *
        </label>
        <IconSelector
          value={formData.icon}
          onChange={(icon) => setFormData({ ...formData, icon })}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3B82F6',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Category
        </button>
      </div>
    </form>
  );
}

// Question Form Component
function QuestionForm({ categories, onSave, onCancel }: {
  categories: TestCategory[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    categoryId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
    
    if (!formData.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    const validOptions = formData.options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    
    if (!formData.correctAnswer) {
      alert('Please select a correct answer');
      return;
    }
    
    onSave(formData);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Category *
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Question *
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter the test question..."
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Options *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formData.options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <input
                type="radio"
                name="correctAnswer"
                value={option}
                checked={formData.correctAnswer === option}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                required
              />
              <span style={{ fontSize: '14px' }}>Correct</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Explanation (Optional)
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Explain why this is the correct answer..."
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            minHeight: '60px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3B82F6',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Question
        </button>
      </div>
    </form>
  );
}

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState<TestCategory | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [selectedCategoryForQuestions, setSelectedCategoryForQuestions] = useState<number | null>(null);
  const [questionsForCategory, setQuestionsForCategory] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [, setLocation] = useLocation();
  const { isLoggedIn } = useAuth();

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/test-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/test-categories");
      return response.categories || response;
    }
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || []);

  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ["/api/test-results"],
    queryFn: async () => {
      const response = await apiClient.get("/test-results");
      return response.results || response;
    }
  });

  const results = Array.isArray(resultsData) ? resultsData : (resultsData?.results || []);

  const handleStartTest = (category: TestCategory) => {
    setSelectedTest(category);
    setIsTestModalOpen(true);
  };

  const handleCategorySave = async (data: any) => {
    try {
      await apiClient.post("/test-categories", data);
      setIsCategoryModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category');
    }
  };

  const handleQuestionSave = async (data: any) => {
    try {
      await apiClient.post("/test-questions", data);
      setIsQuestionModalOpen(false);
      // Refresh questions for the current category
      if (selectedTest) {
        await fetchQuestionsForCategory(selectedTest.id);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Error creating question');
    }
  };

  const fetchQuestionsForCategory = async (categoryId: number) => {
    setIsLoadingQuestions(true);
    try {
      const response = await apiClient.get(`/test-questions/${categoryId}`);
      setQuestionsForCategory(response.questions || response);
      setSelectedCategoryForQuestions(categoryId);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestionsForCategory([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    try {
      await apiClient.delete(`/test-questions/${questionId}`);
      // Refresh questions for the current category
      if (selectedCategoryForQuestions) {
        await fetchQuestionsForCategory(selectedCategoryForQuestions);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question');
    }
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

  if (isLoggedIn) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button for Logged-in Users */}
        <div className="mb-6">
          <Button 
            onClick={() => setLocation('/')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Communication Skill Tests</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evaluate your communication abilities with AI-powered assessments and receive personalized feedback
          </p>
        </div>

        {/* Test Categories */}
        {isLoadingCategories ? (
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
        ) : categories && categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => {
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
              <Button 
                onClick={() => setIsCategoryModalOpen(true)} 
                className="btn-primary"
              >
                <i className="fas fa-plus mr-2"></i> Add Test Category
              </Button>
              <Button 
                onClick={() => setIsQuestionModalOpen(true)} 
                className="btn-secondary"
              >
                <i className="fas fa-plus mr-2"></i> Add Test Question
              </Button>
              <Button 
                onClick={() => setIsManagementModalOpen(true)} 
                className="btn-outline"
              >
                <i className="fas fa-cog mr-2"></i> Manage Tests
              </Button>
            </>
          )}
        </div>

        {/* Modals */}
        <SimpleModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title="Add Test Category"
        >
          <CategoryForm
            onSave={handleCategorySave}
            onCancel={() => setIsCategoryModalOpen(false)}
          />
        </SimpleModal>

        <SimpleModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          title="Add Test Question"
        >
          <QuestionForm
            categories={categories}
            onSave={handleQuestionSave}
            onCancel={() => setIsQuestionModalOpen(false)}
          />
        </SimpleModal>

        <SimpleModal
          isOpen={isManagementModalOpen}
          onClose={() => setIsManagementModalOpen(false)}
          title="Manage Tests"
        >
          <div style={{ 
            padding: '20px 0',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Test Categories Management */}
            <div style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#111827',
                backgroundColor: '#ffffff'
              }}>
                Test Categories
              </h3>
              {categories && categories.length > 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  backgroundColor: '#ffffff'
                }}>
                  {categories.map((category) => (
                    <div key={category.id} style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ backgroundColor: '#ffffff' }}>
                        <h4 style={{ 
                          fontWeight: 'bold', 
                          marginBottom: '4px',
                          color: '#111827',
                          backgroundColor: '#ffffff'
                        }}>
                          {category.name}
                        </h4>
                        <p style={{ 
                          fontSize: '14px', 
                          color: '#6b7280',
                          margin: 0,
                          backgroundColor: '#ffffff'
                        }}>
                          {category.description}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          marginTop: '8px',
                          fontSize: '12px',
                          color: '#6b7280',
                          backgroundColor: '#ffffff'
                        }}>
                          <span>Duration: {category.duration} min</span>
                          <span>Questions: {category.questionCount}</span>
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px',
                        backgroundColor: '#ffffff'
                      }}>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${category.name}"? This will also delete all questions in this category.`)) {
                              try {
                                await apiClient.delete(`/test-categories/${category.id}`);
                                window.location.reload();
                              } catch (error) {
                                console.error('Error deleting category:', error);
                                alert('Error deleting category');
                              }
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ef4444',
                            borderRadius: '4px',
                            backgroundColor: '#ffffff',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ 
                  color: '#6b7280', 
                  textAlign: 'center',
                  backgroundColor: '#ffffff'
                }}>
                  No test categories available
                </p>
              )}
            </div>

            {/* Test Questions Management */}
            <div style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#111827',
                backgroundColor: '#ffffff'
              }}>
                Test Questions
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginBottom: '16px',
                backgroundColor: '#ffffff'
              }}>
                <select
                  id="questionCategoryFilter"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    fontSize: '14px'
                  }}
                  value={selectedCategoryForQuestions || ''}
                  onChange={(e) => {
                    const categoryId = parseInt(e.target.value);
                    if (categoryId) {
                      fetchQuestionsForCategory(categoryId);
                    } else {
                      setQuestionsForCategory([]);
                      setSelectedCategoryForQuestions(null);
                    }
                  }}
                >
                  <option value="">Select a category to view questions</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ 
                maxHeight: '300px', 
                overflow: 'auto',
                backgroundColor: '#ffffff'
              }}>
                {isLoadingQuestions ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#ffffff'
                  }}>
                    <p style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>Loading questions...</p>
                  </div>
                ) : questionsForCategory.length > 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    backgroundColor: '#ffffff'
                  }}>
                    {questionsForCategory.map((question) => (
                      <div key={question.id} style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          backgroundColor: '#ffffff'
                        }}>
                          <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
                            <h4 style={{ 
                              fontWeight: 'bold', 
                              marginBottom: '8px',
                              color: '#111827',
                              backgroundColor: '#ffffff'
                            }}>
                              {question.question}
                            </h4>
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              gap: '4px',
                              backgroundColor: '#ffffff'
                            }}>
                              {question.options?.map((option: string, index: number) => (
                                <div key={index} style={{
                                  padding: '4px 8px',
                                  backgroundColor: question.correctAnswer === index ? '#dcfce7' : '#f3f4f6',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  color: question.correctAnswer === index ? '#166534' : '#374151'
                                }}>
                                  {String.fromCharCode(65 + index)}. {option}
                                  {question.correctAnswer === index && (
                                    <span style={{ 
                                      marginLeft: '8px', 
                                      fontWeight: 'bold',
                                      color: '#059669'
                                    }}>
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginLeft: '12px'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedCategoryForQuestions ? (
                  <p style={{ 
                    color: '#6b7280', 
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                  }}>
                    No questions found for this category
                  </p>
                ) : (
                  <p style={{ 
                    color: '#6b7280', 
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                  }}>
                    Select a category above to view and manage questions
                  </p>
                )}
              </div>
            </div>

            {/* Test Results Management */}
            <div style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#111827',
                backgroundColor: '#ffffff'
              }}>
                Test Results
              </h3>
              {results && results.length > 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  backgroundColor: '#ffffff'
                }}>
                  {results.slice(0, 5).map((result) => {
                    const category = categories?.find(cat => cat.id === result.categoryId);
                    return (
                      <div key={result.id} style={{
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ backgroundColor: '#ffffff' }}>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: '#111827',
                            backgroundColor: '#ffffff'
                          }}>
                            {category?.name || 'Unknown Test'}
                          </span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#6b7280',
                            marginLeft: '8px',
                            backgroundColor: '#ffffff'
                          }}>
                            {formatDate(result.completedAt)}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: '#ffffff'
                        }}>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: '#059669',
                            backgroundColor: '#ffffff'
                          }}>
                            {Math.round((result.score / result.totalQuestions) * 100)}%
                          </span>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this test result?')) {
                                try {
                                  await apiClient.delete(`/test-results/${result.id}`);
                                  window.location.reload();
                                } catch (error) {
                                  console.error('Error deleting test result:', error);
                                  alert('Error deleting test result');
                                }
                              }
                            }}
                            style={{
                              padding: '4px 8px',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {results.length > 5 && (
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      textAlign: 'center',
                      backgroundColor: '#ffffff'
                    }}>
                      Showing 5 most recent results. {results.length - 5} more results available.
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ 
                  color: '#6b7280', 
                  textAlign: 'center',
                  backgroundColor: '#ffffff'
                }}>
                  No test results available
                </p>
              )}
            </div>

            {/* Close Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '20px',
              backgroundColor: '#ffffff'
            }}>
              <button
                onClick={() => setIsManagementModalOpen(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </SimpleModal>

        {selectedTest && (
          <TestModal
            isOpen={isTestModalOpen}
            onOpenChange={setIsTestModalOpen}
            testCategory={selectedTest}
          />
        )}
      </main>
    );
  }

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
      {isLoadingCategories ? (
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
      ) : categories && categories.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => {
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
          {results && results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => {
                const category = categories?.find(cat => cat.id === result.categoryId);
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

      {selectedTest && (
        <TestModal
          isOpen={isTestModalOpen}
          onOpenChange={setIsTestModalOpen}
          testCategory={selectedTest}
        />
      )}
    </main>
  );
}
