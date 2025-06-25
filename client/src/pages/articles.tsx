import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ArticleFormModal from "@/components/article-form-modal";
import type { Article } from "@shared/schema";

export default function Articles() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "All Categories") params.append("category", category);
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    }
  });

  const categories = [
    "All Categories",
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Verbal Communication": "text-primary",
      "Non-Verbal Communication": "text-secondary",
      "Digital Communication": "text-accent",
      "Interpersonal Skills": "text-yellow-600",
      "Workplace Communication": "text-indigo-600",
      "Team Communication": "text-pink-600",
      "Presentation Skills": "text-purple-600",
      "Body Language": "text-green-600",
      "Active Listening": "text-blue-600"
    };
    return colors[category] || "text-gray-600";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const openArticleModal = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <h3 key={index} className="font-bold text-lg mb-2 mt-4">{paragraph.slice(2, -2)}</h3>;
      }
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{paragraph.slice(2)}</li>;
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-3 leading-relaxed">{paragraph}</p>;
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Communication Skills Articles</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Learn from expert insights and practical guides to improve your communication abilities
        </p>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gradient-primary text-white hover:shadow-lg transition-all duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          Create New Article
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
          </div>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden card-hover">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className={`text-sm font-semibold mb-2 ${getCategoryColor(article.category)}`}>
                    {article.category.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="far fa-clock mr-1"></i>
                      <span>{article.readTime} min read</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-blue-700 p-0 h-auto"
                      onClick={() => openArticleModal(article)}
                    >
                      Read More <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    By {article.author} • {formatDate(article.publishedAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button className="bg-primary text-white hover:bg-blue-700">
              Load More Articles
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-search text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {search || category !== "All Categories" 
              ? "Try adjusting your search or filter criteria."
              : "Articles will appear here when available."
            }
          </p>
        </div>
      )}

      {/* Article Creation Modal */}
      <ArticleFormModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />

      {/* Article Reading Modal */}
      {selectedArticle && (
        <Dialog open={isArticleModalOpen} onOpenChange={setIsArticleModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className={`text-sm font-semibold mb-2 ${getCategoryColor(selectedArticle.category)}`}>
                {selectedArticle.category.toUpperCase()}
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 text-left">
                {selectedArticle.title}
              </DialogTitle>
              <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                <div className="flex items-center space-x-4">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{formatDate(selectedArticle.publishedAt)}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <i className="far fa-clock mr-1"></i>
                    <span>{selectedArticle.readTime} min read</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div className="prose max-w-none">
                <div className="text-lg text-gray-700 mb-6 font-medium">
                  {selectedArticle.excerpt}
                </div>
                
                <div className="text-gray-700 leading-relaxed">
                  {formatContent(selectedArticle.content)}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => setIsArticleModalOpen(false)}
                  className="gradient-primary text-white"
                >
                  Close Article
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
