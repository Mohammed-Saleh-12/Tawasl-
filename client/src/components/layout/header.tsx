import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const [location] = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // Navigation items for public users (header only shows when not logged in)
  const navItems = [
    { href: "/", label: "Home", icon: "fas fa-home" },
    { href: "/articles", label: "Articles", icon: "fas fa-book-open" },
    { href: "/tests", label: "Skill Tests", icon: "fas fa-clipboard-check" },
    { href: "/faq", label: "FAQ", icon: "fas fa-question-circle" },
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
          <div className="flex justify-between items-center h-18 py-4">
            {/* Logo and Platform Name - Left side */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-8 h-8 md:w-10 md:h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <i className="fas fa-comments text-white text-sm md:text-lg"></i>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-blue-600">
                      Tawasl
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Navigation Links - Hidden on mobile, centered on desktop */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-100 shadow-sm' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <i className={`${item.icon} text-sm`}></i>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right side - AI Chat on desktop, Mobile menu on mobile */}
            <div className="flex items-center space-x-4">
              {/* Video Analysis Button - Hidden on mobile */}
              <div className="hidden md:block">
                <Link href="/video-practice">
                  <Button className="btn-ghost">
                    <i className="fas fa-video mr-2"></i>
                    Video Practice
                  </Button>
                </Link>
              </div>
              
              {/* Mobile Menu Button - Right side */}
              <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                    <i className="fas fa-bars text-xl text-gray-600"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-l border-gray-200">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <i className={`${item.icon} text-sm w-5`}></i>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-6 border-t border-gray-200 space-y-3">
                      <Link href="/video-practice">
                        <Button
                          variant="outline"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <i className="fas fa-video mr-2"></i>
                          Video Practice
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  );
}
