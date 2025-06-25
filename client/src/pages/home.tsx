import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";
import AIChatModal from "@/components/ai-chat-modal";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const features = [
    {
      title: "Interactive Skill Tests",
      description: "Take comprehensive tests covering verbal communication, body language, active listening, and more with instant AI feedback.",
      icon: "fas fa-clipboard-check",
      color: "bg-primary",
      link: "/tests",
      buttonText: "Start Testing",
      buttonColor: "text-primary"
    },
    {
      title: "Expert Articles",
      description: "Access a comprehensive library of articles on communication techniques, written by industry experts and communication coaches.",
      icon: "fas fa-book-open",
      color: "bg-secondary",
      link: "/articles",
      buttonText: "Read Articles",
      buttonColor: "text-secondary"
    },
    {
      title: "AI Video Analysis",
      description: "Record yourself practicing and get detailed feedback on facial expressions, eye contact, and body language.",
      icon: "fas fa-video",
      color: "bg-accent",
      link: "/video-practice",
      buttonText: "Try Video Practice",
      buttonColor: "text-accent"
    },
    {
      title: "AI Practice Partner",
      description: "Practice conversations with our AI chatbot that adapts to your skill level and provides real-time feedback.",
      icon: "fas fa-robot",
      color: "bg-yellow-500",
      link: "#",
      buttonText: "Start Chatting",
      buttonColor: "text-yellow-600",
      onClick: () => setIsChatOpen(true)
    },
    {
      title: "Progress Analytics",
      description: "Track your improvement over time with detailed analytics and personalized recommendations for skill development.",
      icon: "fas fa-chart-bar",
      color: "bg-indigo-500",
      link: "/tests",
      buttonText: "View Progress",
      buttonColor: "text-indigo-600"
    },
    {
      title: "Expert Q&A",
      description: "Get instant answers to common communication questions and challenges with our comprehensive FAQ database.",
      icon: "fas fa-question-circle",
      color: "bg-pink-500",
      link: "/faq",
      buttonText: "Browse FAQ",
      buttonColor: "text-pink-600"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Learners", color: "text-primary" },
    { value: "500+", label: "Expert Articles", color: "text-accent" },
    { value: "50+", label: "Skill Tests", color: "text-secondary" },
    { value: "98%", label: "Success Rate", color: "text-yellow-400" }
  ];

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative gradient-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-12 lg:mb-0">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  Master Your <span className="text-yellow-300">Communication</span> Skills
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Enhance your communication abilities through AI-powered assessments, interactive practice, and personalized feedback designed for professionals and students.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/tests">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                      <i className="fas fa-play mr-2"></i>
                      Start Your First Test
                    </Button>
                  </Link>
                  <Link href="/video-practice">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      <i className="fas fa-video mr-2"></i>
                      Practice with Video
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional team meeting demonstrating effective communication skills" 
                  className="rounded-xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent text-white p-3 rounded-full">
                      <i className="fas fa-chart-line text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Users Improved</p>
                      <p className="text-2xl font-bold text-gray-900">89%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Communicate Better
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From interactive skill tests to AI-powered video analysis, Tawasl provides comprehensive tools for improving your communication abilities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`${feature.color} text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                      <i className={`${feature.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    {feature.onClick ? (
                      <Button 
                        variant="ghost" 
                        className={`${feature.buttonColor} hover:bg-gray-100 p-0 h-auto font-semibold`}
                        onClick={feature.onClick}
                      >
                        {feature.buttonText} <i className="fas fa-arrow-right ml-1"></i>
                      </Button>
                    ) : (
                      <Link href={feature.link}>
                        <Button 
                          variant="ghost" 
                          className={`${feature.buttonColor} hover:bg-gray-100 p-0 h-auto font-semibold`}
                        >
                          {feature.buttonText} <i className="fas fa-arrow-right ml-1"></i>
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AIChatModal isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}
