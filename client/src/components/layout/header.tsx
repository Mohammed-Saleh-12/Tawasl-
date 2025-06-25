import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AIChatModal from "@/components/ai-chat-modal";

export default function Header() {
  const [location] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: "fas fa-home" },
    { href: "/articles", label: "Articles", icon: "fas fa-book-open" },
    { href: "/tests", label: "Skill Tests", icon: "fas fa-clipboard-check" },
    { href: "/faq", label: "FAQ", icon: "fas fa-question-circle" },
    { href: "/video-practice", label: "Video Practice", icon: "fas fa-video" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <i className="fas fa-comments text-white text-lg"></i>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Tawasl
                    </h1>
                  </div>
                </Link>
              </div>
              <div className="hidden lg:block ml-10">
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                          isActive(item.href)
                            ? "text-primary bg-blue-50 shadow-sm"
                            : "text-gray-600 hover:text-primary hover:bg-blue-50/50"
                        }`}
                      >
                        <i className={`${item.icon} text-sm`}></i>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsChatOpen(true)}
                  className="text-primary border-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <i className="fas fa-robot mr-2"></i>
                  AI Coach
                </Button>
                <Button className="gradient-primary text-white hover:shadow-lg transition-all duration-200 px-6">
                  <i className="fas fa-rocket mr-2"></i>
                  Get Started
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <i className="fas fa-bars text-xl text-gray-600"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                      <i className="fas fa-comments text-white"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Tawasl</h2>
                  </div>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-blue-50"
                              : "text-gray-600 hover:text-primary hover:bg-blue-50/50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <i className={`${item.icon} text-sm w-5`}></i>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-6 border-t border-gray-200 space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChatOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-primary border-primary hover:bg-primary hover:text-white"
                      >
                        <i className="fas fa-robot mr-2"></i>
                        AI Coach
                      </Button>
                      <Button className="w-full gradient-primary text-white">
                        <i className="fas fa-rocket mr-2"></i>
                        Get Started
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <AIChatModal isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}
