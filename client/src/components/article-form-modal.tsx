import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ArticleFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArticleFormModal({ isOpen, onOpenChange }: ArticleFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    readTime: 5,
    imageUrl: ""
  });

  const { toast } = useToast();

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: any) => {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...articleData,
          publishedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error("Failed to create article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Article Created",
        description: "Your article has been published successfully!"
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "There was an error creating your article. Please try again.",
        variant: "destructive"
      });
    }
  });

  const categories = [
    "Verbal Communication",
    "Non-Verbal Communication",
    "Active Listening",
    "Body Language", 
    "Presentation Skills",
    "Digital Communication",
    "Interpersonal Skills",
    "Workplace Communication",
    "Team Communication"
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      readTime: 5,
      imageUrl: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createArticleMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Create New Article</DialogTitle>
          <p className="text-gray-600">Share your communication expertise with the community</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Article Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter an engaging article title"
                className="mt-1"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                Author Name *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Your name"
                className="mt-1"
                required
              />
            </div>

            {/* Read Time */}
            <div>
              <Label htmlFor="readTime" className="text-sm font-medium text-gray-700">
                Estimated Read Time (minutes)
              </Label>
              <Input
                id="readTime"
                type="number"
                min="1"
                max="60"
                value={formData.readTime}
                onChange={(e) => handleInputChange("readTime", parseInt(e.target.value) || 5)}
                className="mt-1"
              />
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                Image URL (optional)
              </Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                Article Excerpt *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Write a compelling summary that will appear in article previews"
                className="mt-1 min-h-[80px]"
                required
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Article Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your full article content here. You can use markdown formatting..."
                className="mt-1 min-h-[300px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use **bold**, *italic*, and bullet points to format your content
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createArticleMutation.isPending}
              className="flex-1 bg-primary hover:bg-blue-700"
            >
              {createArticleMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="fas fa-publish mr-2"></i>
                  Publish Article
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}