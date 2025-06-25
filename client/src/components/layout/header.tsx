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
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/tests", label: "Skill Tests" },
    { href: "/faq", label: "FAQ" },
    { href: "/video-practice", label: "Video Practice" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary cursor-pointer">Tawasl</h1>
                </Link>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-gray-900 bg-gray-100"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsChatOpen(true)}
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  <i className="fas fa-robot mr-2"></i>
                  AI Coach
                </Button>
                <Button className="bg-primary text-white hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-bars text-xl"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-6">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a
                          className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChatOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full mb-2 text-primary border-primary hover:bg-primary hover:text-white"
                      >
                        <i className="fas fa-robot mr-2"></i>
                        AI Coach
                      </Button>
                      <Button className="w-full bg-primary text-white hover:bg-blue-700">
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
