import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { TestCategory, TestQuestion } from "@shared/schema";

interface TestFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: TestCategory | null;
  editingQuestion?: TestQuestion | null;
  mode: 'category' | 'question';
  categories?: TestCategory[];
}

const icons = [
  'fas fa-clipboard-check',
  'fas fa-comments',
  'fas fa-microphone',
  'fas fa-users',
  'fas fa-handshake',
  'fas fa-eye',
  'fas fa-ear',
  'fas fa-brain',
  'fas fa-lightbulb',
  'fas fa-star'
];

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function TestFormModal({ 
  isOpen, 
  onOpenChange, 
  editingCategory, 
  editingQuestion, 
  mode, 
  categories
}: TestFormModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 10,
    color: 'bg-blue-500',
    icon: 'fas fa-question',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    categoryId: ''
  });

  // Load editing data
  useEffect(() => {
    if (editingCategory && mode === 'category') {
      setFormData({
        ...formData,
        name: editingCategory.name,
        description: editingCategory.description,
        duration: editingCategory.duration,
        color: editingCategory.color,
        icon: editingCategory.icon
      });
    } else if (editingQuestion && mode === 'question') {
      setFormData({
        ...formData,
        question: editingQuestion.question,
        options: editingQuestion.options,
        correctAnswer: editingQuestion.correctAnswer,
        explanation: editingQuestion.explanation || '',
        categoryId: editingQuestion.categoryId.toString()
      });
    } else {
      // Reset form for new items
      setFormData({
        name: '',
        description: '',
        duration: 10,
        color: 'bg-blue-500',
        icon: 'fas fa-question',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        categoryId: ''
      });
    }
  }, [editingCategory, editingQuestion, mode]);

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.post('/api/test-categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-categories'] });
      toast({
        title: "Success",
        description: "Test category created successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create test category. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.put(`/api/test-categories/${editingCategory?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-categories'] });
      toast({
        title: "Success",
        description: "Test category updated successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update test category. Please try again.",
        variant: "destructive"
      });
    }
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.post('/api/test-questions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-questions'] });
      toast({
        title: "Success",
        description: "Test question created successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create test question. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.put(`/api/test-questions/${editingQuestion?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-questions'] });
      toast({
        title: "Success",
        description: "Test question updated successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update test question. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'category') {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        color: formData.color,
        icon: formData.icon
      };

      if (editingCategory) {
        updateCategoryMutation.mutate(categoryData);
      } else {
        createCategoryMutation.mutate(categoryData);
      }
    } else {
      const questionData = {
        question: formData.question,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        categoryId: parseInt(formData.categoryId)
      };

      if (editingQuestion) {
        updateQuestionMutation.mutate(questionData);
      } else {
        createQuestionMutation.mutate(questionData);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending || 
                   createQuestionMutation.isPending || updateQuestionMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-white dark:!bg-zinc-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCategory || editingQuestion ? 'Edit' : 'Add'} {mode === 'category' ? 'Test Category' : 'Test Question'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'category' ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Active Listening"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this test covers..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min="1"
                      max="60"
                      required
                    />
                  </div>

                </div>

                <div>
                  <Label htmlFor="color">Color Theme</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="icon">Icon (FontAwesome class)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., fas fa-ear"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the test question..."
                    required
                  />
                </div>

                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={option}
                          checked={formData.correctAnswer === option}
                          onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                          required
                        />
                        <Label className="text-sm">Correct</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer..."
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : (editingCategory || editingQuestion ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 