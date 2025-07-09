import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Tests from "@/pages/tests";
import FAQ from "@/pages/faq";
import VideoPractice from "@/pages/video-practice";
import Header from "@/components/layout/header";
import { useEffect } from "react";
import Login from "@/pages/login";

function Router() {
  // Redirect to dashboard if logged in and not on /login
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("platform_logged_in") === "true" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "http://localhost:5174";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/articles" component={Articles} />
        <Route path="/tests" component={Tests} />
        <Route path="/faq" component={FAQ} />
        <Route path="/video-practice" component={VideoPractice} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
