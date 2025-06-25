import { 
  users, articles, testCategories, testQuestions, testResults, faqs, videoAnalyses,
  type User, type InsertUser, type Article, type InsertArticle,
  type TestCategory, type InsertTestCategory, type TestQuestion, type InsertTestQuestion,
  type TestResult, type InsertTestResult, type FAQ, type InsertFAQ,
  type VideoAnalysis, type InsertVideoAnalysis
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticles(search?: string, category?: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Test methods
  getTestCategories(): Promise<TestCategory[]>;
  getTestCategory(id: number): Promise<TestCategory | undefined>;
  getTestQuestions(categoryId: number): Promise<TestQuestion[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getUserTestResults(userId?: number): Promise<TestResult[]>;
  
  // FAQ methods
  getFAQs(search?: string, category?: string): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  
  // Video analysis methods
  createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getUserVideoAnalyses(userId?: number): Promise<VideoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private testCategories: Map<number, TestCategory>;
  private testQuestions: Map<number, TestQuestion>;
  private testResults: Map<number, TestResult>;
  private faqs: Map<number, FAQ>;
  private videoAnalyses: Map<number, VideoAnalysis>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.testCategories = new Map();
    this.testQuestions = new Map();
    this.testResults = new Map();
    this.faqs = new Map();
    this.videoAnalyses = new Map();
    this.currentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed articles
    const sampleArticles: Article[] = [
      {
        id: this.currentId++,
        title: "The Art of Active Listening: 10 Techniques That Transform Conversations",
        excerpt: "Master the fundamental skill of active listening with proven techniques that enhance understanding and build stronger relationships.",
        content: "Active listening is more than just hearing words...",
        category: "Verbal Communication",
        author: "Dr. Sarah Johnson",
        publishedAt: new Date("2024-01-15"),
        readTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        id: this.currentId++,
        title: "Mastering Body Language: How to Project Confidence in Every Interaction",
        excerpt: "Learn how to use body language effectively to communicate confidence, build trust, and enhance your professional presence.",
        content: "Body language accounts for 55% of all communication...",
        category: "Non-Verbal Communication",
        author: "Mark Thompson",
        publishedAt: new Date("2024-01-10"),
        readTime: 7,
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        id: this.currentId++,
        title: "Virtual Communication Mastery: Excelling in Remote Work Environments",
        excerpt: "Navigate the challenges of virtual communication with strategies for video calls, remote collaboration, and digital presence.",
        content: "The shift to remote work has fundamentally changed...",
        category: "Digital Communication",
        author: "Lisa Chen",
        publishedAt: new Date("2024-01-05"),
        readTime: 6,
        imageUrl: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Seed test categories
    const sampleTestCategories: TestCategory[] = [
      {
        id: this.currentId++,
        name: "Verbal Communication",
        description: "Test your speaking clarity, tone, and verbal expression skills through various scenarios.",
        duration: 15,
        questionCount: 20,
        color: "bg-blue-500",
        icon: "fas fa-microphone"
      },
      {
        id: this.currentId++,
        name: "Body Language",
        description: "Assess your understanding of non-verbal cues and body language interpretation.",
        duration: 12,
        questionCount: 15,
        color: "bg-purple-500",
        icon: "fas fa-user-friends"
      },
      {
        id: this.currentId++,
        name: "Active Listening",
        description: "Evaluate your listening skills and ability to understand and respond appropriately.",
        duration: 10,
        questionCount: 12,
        color: "bg-green-500",
        icon: "fas fa-ear-listen"
      }
    ];

    sampleTestCategories.forEach(category => {
      this.testCategories.set(category.id, category);
    });

    // Seed test questions
    const sampleQuestions: TestQuestion[] = [
      {
        id: this.currentId++,
        categoryId: sampleTestCategories[0].id,
        question: "Which of the following is the most effective way to show active listening during a conversation?",
        options: [
          "Nodding frequently while planning your response",
          "Maintaining eye contact and asking clarifying questions",
          "Taking detailed notes while the person speaks",
          "Offering immediate solutions to their problems"
        ],
        correctAnswer: "Maintaining eye contact and asking clarifying questions",
        explanation: "Active listening involves being fully present and engaged, which is best demonstrated through eye contact and clarifying questions."
      },
      {
        id: this.currentId++,
        categoryId: sampleTestCategories[1].id,
        question: "What does crossed arms typically indicate in body language?",
        options: [
          "Openness and receptivity",
          "Defensiveness or resistance",
          "Confidence and authority",
          "Excitement and enthusiasm"
        ],
        correctAnswer: "Defensiveness or resistance",
        explanation: "Crossed arms often signal a defensive posture or resistance to what's being communicated."
      }
    ];

    sampleQuestions.forEach(question => {
      this.testQuestions.set(question.id, question);
    });

    // Seed FAQs
    const sampleFAQs: FAQ[] = [
      {
        id: this.currentId++,
        question: "How long does it typically take to see improvement in communication skills?",
        answer: "Most users begin to notice improvements within 2-3 weeks of consistent practice. Significant changes typically occur after 1-2 months of regular engagement with our platform.",
        category: "General"
      },
      {
        id: this.currentId++,
        question: "What makes your AI analysis more accurate than other platforms?",
        answer: "Our AI uses advanced machine learning models trained on thousands of hours of communication data from professional speakers, coaches, and successful communicators.",
        category: "Platform"
      }
    ];

    sampleFAQs.forEach(faq => {
      this.faqs.set(faq.id, faq);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArticles(search?: string, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (search) {
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category && category !== "All Categories") {
      articles = articles.filter(article => article.category === category);
    }
    
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  async getTestCategories(): Promise<TestCategory[]> {
    return Array.from(this.testCategories.values());
  }

  async getTestCategory(id: number): Promise<TestCategory | undefined> {
    return this.testCategories.get(id);
  }

  async getTestQuestions(categoryId: number): Promise<TestQuestion[]> {
    return Array.from(this.testQuestions.values()).filter(
      question => question.categoryId === categoryId
    );
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const id = this.currentId++;
    const result: TestResult = { 
      ...insertResult, 
      id, 
      completedAt: new Date() 
    };
    this.testResults.set(id, result);
    return result;
  }

  async getUserTestResults(userId?: number): Promise<TestResult[]> {
    if (!userId) return [];
    return Array.from(this.testResults.values())
      .filter(result => result.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getFAQs(search?: string, category?: string): Promise<FAQ[]> {
    let faqs = Array.from(this.faqs.values());
    
    if (search) {
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category && category !== "All Topics") {
      faqs = faqs.filter(faq => faq.category === category);
    }
    
    return faqs;
  }

  async createFAQ(insertFAQ: InsertFAQ): Promise<FAQ> {
    const id = this.currentId++;
    const faq: FAQ = { ...insertFAQ, id };
    this.faqs.set(id, faq);
    return faq;
  }

  async createVideoAnalysis(insertAnalysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const id = this.currentId++;
    const analysis: VideoAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: new Date() 
    };
    this.videoAnalyses.set(id, analysis);
    return analysis;
  }

  async getUserVideoAnalyses(userId?: number): Promise<VideoAnalysis[]> {
    if (!userId) return [];
    return Array.from(this.videoAnalyses.values())
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
