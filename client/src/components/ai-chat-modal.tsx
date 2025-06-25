import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChatModal({ isOpen, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI communication coach. I'm here to help you practice your conversation skills. What would you like to work on today? I can help with:\n\n• Job interview practice\n• Presentation skills\n• Active listening exercises\n• Conflict resolution scenarios",
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          context: messages.slice(-5) // Send last 5 messages for context
        })
      });
      
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
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
      <DialogContent className="max-w-4xl w-full h-[600px] flex flex-col p-0">
        {/* Chat Header */}
        <DialogHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary text-white p-3 rounded-full">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">AI Communication Coach</DialogTitle>
              <p className="text-sm text-green-600">
                <i className="fas fa-circle text-xs mr-1"></i>
                Online - Ready to help you practice
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
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
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.isUser && (
                  <div className="bg-primary text-white p-2 rounded-full flex-shrink-0">
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
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
                disabled={chatMutation.isPending}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <i className="fas fa-smile text-gray-400"></i>
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-primary hover:bg-blue-700"
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
            <Button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
              title="Voice Input"
            >
              <i className={`fas fa-microphone ${isListening ? 'animate-pulse' : ''}`}></i>
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>AI will analyze your communication style and provide feedback</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
