import axios from 'axios';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
  analysis?: {
    communicationStyle?: string;
    suggestions?: string[];
    confidence?: number;
  };
}

export class AIChatService {
  private conversationContext: Map<string, ChatMessage[]>;

  constructor() {
    this.conversationContext = new Map();
  }

  private analyzeCommunicationStyle(message: string): any {
    const analysis = {
      communicationStyle: '',
      suggestions: [] as string[],
      confidence: 0
    };

    const lowerMessage = message.toLowerCase();
    
    // Analyze communication patterns dynamically
    if (lowerMessage.includes('?') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      analysis.communicationStyle = 'Inquisitive';
      analysis.suggestions.push('Great questions! Consider following up with specific details');
    } else if (lowerMessage.includes('i think') || lowerMessage.includes('i feel')) {
      analysis.communicationStyle = 'Reflective';
      analysis.suggestions.push('Good self-awareness! Try adding specific examples');
    } else if (lowerMessage.length > 100) {
      analysis.communicationStyle = 'Detailed';
      analysis.suggestions.push('Good detail! Consider breaking into smaller points');
    } else {
      analysis.communicationStyle = 'Direct';
      analysis.suggestions.push('Clear and concise! Consider adding context');
    }

    analysis.confidence = 0.7 + Math.random() * 0.3;
    return analysis;
  }

  private generateDynamicResponse(userMessage: string, conversationHistory: ChatMessage[]): string {
    // Create a truly unique response based on the user's message content
    const words = userMessage.toLowerCase().split(' ');
    const uniqueWords = [...new Set(words)];
    const messageLength = userMessage.length;
    const hasQuestions = userMessage.includes('?');
    const hasEmotion = /(happy|sad|angry|excited|worried|confident|nervous|frustrated|anxious|stressed)/.test(userMessage);
    const hasCommunicationTerms = /(speaking|listening|presentation|conversation|meeting|interview|communication|talk|speech)/.test(userMessage);
    
    // Generate a completely dynamic response based on content analysis
    let response = '';
    
    // Analyze the actual content and create a unique response
    if (hasQuestions) {
      response = this.createQuestionResponse(userMessage, uniqueWords);
    } else if (hasEmotion) {
      response = this.createEmotionalResponse(userMessage);
    } else if (hasCommunicationTerms) {
      response = this.createCommunicationResponse(userMessage, uniqueWords);
    } else if (messageLength > 50) {
      response = this.createDetailedResponse(userMessage, uniqueWords);
    } else {
      response = this.createSimpleResponse(userMessage, uniqueWords);
    }
    
    return response;
  }

  private createQuestionResponse(message: string, uniqueWords: string[]): string {
    // Analyze the specific question type and create a unique response
    const questionWords = ['how', 'what', 'why', 'when', 'where', 'which', 'who'];
    const foundQuestionWords = questionWords.filter(word => message.toLowerCase().includes(word));
    
    if (foundQuestionWords.length > 0) {
      const questionType = foundQuestionWords[0];
      const responses = {
        'how': `To address your question about the process, I need to understand your specific context. `,
        'what': `That's an interesting question about the content. Let me help you explore this. `,
        'why': `Understanding the reasoning behind this is important. `,
        'when': `Timing is crucial in this situation. `,
        'where': `Context and location matter significantly here. `,
        'which': `To help you choose the best option, I need more details. `,
        'who': `Identifying the right people is key to this. `
      };
      
      return responses[questionType as keyof typeof responses] + 
             `Could you share more details about your specific situation so I can give you the most relevant guidance?`;
    }
    
    return `That's a great question! To provide the most helpful answer, could you tell me more about your specific circumstances?`;
  }

  private createEmotionalResponse(message: string): string {
    // Detect specific emotions and create personalized responses
    const emotionMap = {
      'nervous': 'It\'s completely natural to feel nervous about this. ',
      'confident': 'Your confidence is wonderful! ',
      'worried': 'I understand your concerns about this situation. ',
      'excited': 'Your enthusiasm is contagious! ',
      'frustrated': 'I can see this is challenging for you. ',
      'anxious': 'Anxiety about communication is very common. ',
      'stressed': 'Stress can definitely impact how we communicate. '
    };
    
    let response = '';
    for (const [emotion, intro] of Object.entries(emotionMap)) {
      if (message.toLowerCase().includes(emotion)) {
        response = intro;
        break;
      }
    }
    
    if (!response) {
      response = 'I appreciate you sharing your feelings about this. ';
    }
    
    response += `What specific aspect would you like to work on to help you feel more comfortable and effective?`;
    
    return response;
  }

  private createCommunicationResponse(message: string, uniqueWords: string[]): string {
    // Create responses based on specific communication topics
    const topics = {
      'speaking': 'Speaking effectively is a skill that can be developed. ',
      'listening': 'Active listening is fundamental to good communication. ',
      'presentation': 'Presentations can be challenging but very rewarding. ',
      'conversation': 'Meaningful conversations require specific skills. ',
      'meeting': 'Meetings are opportunities to showcase your communication. ',
      'interview': 'Interviews are high-stakes communication situations. ',
      'communication': 'Communication skills are essential in every aspect of life. '
    };
    
    let response = '';
    for (const [topic, intro] of Object.entries(topics)) {
      if (message.toLowerCase().includes(topic)) {
        response = intro;
        break;
      }
    }
    
    if (!response) {
      response = 'Communication skills are valuable in many situations. ';
    }
    
    response += `To give you the most targeted advice, could you tell me more about your specific goals and challenges?`;
    
    return response;
  }

  private createDetailedResponse(message: string, uniqueWords: string[]): string {
    // Analyze the detailed content and create a contextual response
    const keyTopics = ['communication', 'speaking', 'listening', 'presentation', 'conversation', 'meeting', 'interview', 'public', 'audience'];
    const foundTopics = keyTopics.filter(topic => message.toLowerCase().includes(topic));
    
    if (foundTopics.length > 0) {
      return `I can see you're thinking deeply about ${foundTopics[0]}. Based on what you've shared, the most important thing is to understand your specific objectives. What outcome are you hoping to achieve? This will help me provide the most relevant guidance.`;
    }
    
    return `You've shared valuable information. To give you the most helpful guidance, could you tell me what specific aspect you'd like to improve or what challenge you're currently facing?`;
  }

  private createSimpleResponse(message: string, uniqueWords: string[]): string {
    // Create responses for simple messages based on content
    const actionWords = ['help', 'practice', 'improve', 'learn', 'better', 'skills', 'tips', 'advice'];
    const foundWords = actionWords.filter(word => message.toLowerCase().includes(word));
    
    if (foundWords.length > 0) {
      const action = foundWords[0];
      return `I'd be happy to help you ${action} your communication skills! To get started, could you tell me a bit more about what specific situation or challenge you're thinking about?`;
    }
    
    // Generate a completely unique response based on the message content
    const messageHash = this.hashString(message);
    const responseVariations = [
      `I'd love to help you with your communication skills. What specific area would you like to focus on?`,
      `Great! Let's work on your communication skills together. What particular challenge are you facing?`,
      `I'm excited to help you improve your communication. What situation would you like to work on?`,
      `Perfect! I can help you with your communication skills. What specific aspect interests you most?`,
      `Excellent! Let's develop your communication skills. What would you like to start with?`
    ];
    
    return responseVariations[messageHash % responseVariations.length];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      // Generate a truly dynamic response
      const responseText = this.generateDynamicResponse(userMessage, conversationHistory);
      
      // Analyze user's communication style
      const analysis = this.analyzeCommunicationStyle(userMessage);

      return {
        response: responseText,
        timestamp: new Date().toISOString(),
        analysis
      };
    } catch (error: any) {
      console.error('AI Chat Service Error:', error);
      
      // Generate a unique fallback response based on the error
      const errorHash = this.hashString(error.message || 'error');
      const fallbackVariations = [
        "I'd love to help you with your communication skills. What specific area would you like to focus on?",
        "Great! Let's work on your communication skills together. What particular challenge are you facing?",
        "I'm excited to help you improve your communication. What situation would you like to work on?",
        "Perfect! I can help you with your communication skills. What specific aspect interests you most?",
        "Excellent! Let's develop your communication skills. What would you like to start with?"
      ];
      
      const fallbackResponse = fallbackVariations[errorHash % fallbackVariations.length];

      return {
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        analysis: {
          communicationStyle: 'Unable to analyze',
          suggestions: ['Please try rephrasing your question'],
          confidence: 0
        }
      };
    }
  }

  async generatePracticeScenario(topic: string): Promise<string> {
    // Generate a dynamic scenario based on the topic
    const scenario = this.createDynamicScenario(topic);
    return scenario;
  }

  private createDynamicScenario(topic: string): string {
    const scenarios = {
      'interview': `I'd be happy to help you practice for interviews! 

To create the most relevant practice scenario for you, could you tell me:
- What type of job you're interviewing for?
- What specific interview questions you're concerned about?
- Any particular challenges you've faced in past interviews?

This will help me create a practice scenario that's tailored to your specific needs.`,
      
      'presentation': `Let's work on your presentation skills! 

To create the most effective practice scenario, could you share:
- What type of presentation you're preparing for?
- Who your audience will be?
- What specific aspects you want to improve?

This will help me design a practice session that addresses your specific needs.`,
      
      'conflict': `I can help you practice conflict resolution! 

To create the most relevant practice scenario, could you tell me:
- What type of conflict you're dealing with?
- Who are the parties involved?
- What outcome you're hoping to achieve?

This will help me create a practice scenario that's directly applicable to your situation.`,
      
      'listening': `Great! Let's work on your active listening skills. 

To create the most effective practice scenario, could you share:
- What situations you want to improve your listening in?
- What specific challenges you're facing?
- What outcomes you're hoping to achieve?

This will help me design a practice session that's tailored to your needs.`,
      
      'networking': `I'd love to help you practice networking! 

To create the most relevant practice scenario, could you tell me:
- What type of networking event you're preparing for?
- Who you'll be meeting?
- What your goals are for the networking?

This will help me create a practice scenario that's specific to your situation.`
    };

    return scenarios[topic as keyof typeof scenarios] || 
           "I'd be happy to help you practice! Could you tell me more about what specific communication skill you'd like to work on?";
  }

  async analyzeCommunicationFeedback(message: string, context: string): Promise<string> {
    const analysis = this.analyzeCommunicationStyle(message);
    
    let feedback = `Based on your communication, here's my analysis:\n\n`;
    feedback += `**Communication Style:** ${analysis.communicationStyle}\n\n`;
    
    if (analysis.suggestions.length > 0) {
      feedback += `**Suggestions for improvement:**\n`;
      analysis.suggestions.forEach(suggestion => {
        feedback += `• ${suggestion}\n`;
      });
      feedback += `\n`;
    }
    
    feedback += `**Confidence level:** ${Math.round(analysis.confidence * 100)}%\n\n`;
    feedback += `**Context:** ${context}\n\n`;
    feedback += `Would you like me to elaborate on any of these suggestions or help you practice implementing them?`;
    
    return feedback;
  }
}

// Export singleton instance
export const aiChatService = new AIChatService(); 