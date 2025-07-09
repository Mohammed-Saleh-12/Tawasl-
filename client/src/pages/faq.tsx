import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import type { FAQ } from "@shared/schema";

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true';

  const { data: faqs, isLoading } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs", search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory !== "All Topics") params.append("category", selectedCategory);
      
      const response = await fetch(`/api/faqs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      return response.json();
    }
  });

  const categories = [
    "All Topics",
    "General",
    "Platform",
    "Verbal Communication",
    "Body Language",
    "Presentations",
    "Platform Usage"
  ];

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (openItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about communication skills and our platform
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary text-white" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : faqs && faqs.length > 0 ? (
        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.id} className="shadow-lg">
              <Collapsible open={openItems.has(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                <CollapsibleTrigger className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isLoggedIn && (
                      <>
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit(faq); }}>
                          <i className="fas fa-edit text-gray-500"></i>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(faq); }}>
                          <i className="fas fa-trash text-red-500"></i>
                        </Button>
                      </>
                    )}
                    <i className={`fas fa-chevron-down text-gray-400 transform transition-transform ${
                      openItems.has(faq.id) ? 'rotate-180' : ''
                    }`}></i>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-question-circle text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
          <p className="text-gray-600">
            {search || selectedCategory !== "All Topics" 
              ? "Try adjusting your search or filter criteria."
              : "FAQs will appear here when available."
            }
          </p>
        </div>
      )}

      {/* Contact Support */}
      <div className="mt-12 text-center bg-gray-100 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Still have questions?</h3>
        <p className="text-gray-600 mb-6">Our support team is here to help you make the most of your communication skills journey.</p>
        <Button className="bg-primary text-white hover:bg-blue-700">
          <i className="fas fa-envelope mr-2"></i>
          Contact Support
        </Button>
      </div>
    </main>
  );
}
