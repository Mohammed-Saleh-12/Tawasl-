import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  analysis?: {
    communicationStyle?: string;
    suggestions?: string[];
    confidence?: number;
  };
}

interface AIChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChatModal({ isOpen, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI communication coach. I'm here to help you improve your communication skills through personalized coaching and analysis. What would you like to work on today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiClient.post("/chat", { 
        message, 
        context: messages.slice(-5) // Send last 5 messages for context
      });
      return response;
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        analysis: data.analysis
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not access microphone. Please try typing instead.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please type your message.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[600px] flex flex-col p-0 bg-white border-0 shadow-2xl">
        {/* Chat Header */}
        <DialogHeader className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full">
              <i className="fas fa-brain text-xl"></i>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">AI Communication Skills Coach</DialogTitle>
              <p className="text-sm text-green-600">
                <i className="fas fa-circle text-xs mr-1"></i>
                Online - Powered by Real AI
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Personalized communication coaching • Real-time analysis • Dynamic responses
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6 bg-white" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'justify-end' : ''}`}
              >
                {!message.isUser && (
                  <div className="bg-primary text-white p-2 rounded-full flex-shrink-0">
                    <i className="fas fa-robot text-sm"></i>
                  </div>
                )}
                <div
                  className={`max-w-md p-4 rounded-lg ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  
                  {/* Communication Analysis for AI messages */}
                  {!message.isUser && message.analysis && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-chart-line text-blue-600"></i>
                        <span className="text-sm font-semibold text-blue-800">Communication Analysis</span>
                      </div>
                      {message.analysis.communicationStyle && (
                        <p className="text-xs text-blue-700 mb-1">
                          <strong>Style:</strong> {message.analysis.communicationStyle}
                        </p>
                      )}
                      {message.analysis.suggestions && message.analysis.suggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-blue-700 mb-1"><strong>Suggestions:</strong></p>
                          <ul className="text-xs text-blue-600 space-y-1">
                            {message.analysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.analysis.confidence && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-blue-700">Confidence:</span>
                          <div className="flex-1 bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${message.analysis.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-blue-700">{Math.round(message.analysis.confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.isUser && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full flex-shrink-0 shadow-lg">
                    <i className="fas fa-user text-sm"></i>
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-white p-2 rounded-full flex-shrink-0">
                  <i className="fas fa-robot text-sm"></i>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg max-w-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-stretch space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Start a conversation about communication skills..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12"
                disabled={chatMutation.isPending}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <i className="fas fa-paper-plane text-lg"></i>
            </Button>
            <Button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`px-4 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
              }`}
              title="Voice Input"
            >
              <i className={`fas fa-microphone text-lg ${isListening ? 'animate-bounce' : ''}`}></i>
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>🤖 Powered by Real AI - Dynamic communication coaching</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
