import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { search, category } = req.query;
      const articles = await storage.getArticles(
        search as string,
        category as string
      );
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleSchema = z.object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        category: z.string().min(1),
        author: z.string().min(1),
        publishedAt: z.string().transform(str => new Date(str)),
        readTime: z.number().positive(),
        imageUrl: z.string().url().optional()
      });

      const data = articleSchema.parse(req.body);
      const article = await storage.createArticle(data);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  // Test routes
  app.get("/api/test-categories", async (req, res) => {
    try {
      const categories = await storage.getTestCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test categories" });
    }
  });

  app.get("/api/test-categories/:id/questions", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const questions = await storage.getTestQuestions(categoryId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test questions" });
    }
  });

  app.post("/api/test-results", async (req, res) => {
    try {
      const resultSchema = z.object({
        userId: z.number().optional(),
        categoryId: z.number(),
        score: z.number(),
        totalQuestions: z.number(),
        answers: z.record(z.string()),
        feedback: z.string().optional()
      });

      const data = resultSchema.parse(req.body);
      const result = await storage.createTestResult(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid test result data" });
    }
  });

  app.get("/api/test-results", async (req, res) => {
    try {
      const { userId } = req.query;
      const results = await storage.getUserTestResults(
        userId ? parseInt(userId as string) : undefined
      );
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { search, category } = req.query;
      const faqs = await storage.getFAQs(
        search as string,
        category as string
      );
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  // Video analysis routes
  app.post("/api/video-analysis", async (req, res) => {
    try {
      const analysisSchema = z.object({
        userId: z.number().optional(),
        scenario: z.string(),
        overallScore: z.number(),
        eyeContactScore: z.number(),
        facialExpressionScore: z.number(),
        gestureScore: z.number(),
        postureScore: z.number(),
        feedback: z.array(z.string())
      });

      const data = analysisSchema.parse(req.body);
      const analysis = await storage.createVideoAnalysis(data);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Invalid video analysis data" });
    }
  });

  app.get("/api/video-analyses", async (req, res) => {
    try {
      const { userId } = req.query;
      const analyses = await storage.getUserVideoAnalyses(
        userId ? parseInt(userId as string) : undefined
      );
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video analyses" });
    }
  });

  // AI Chat endpoint (mock implementation)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      // Mock AI response generation
      const responses = [
        "That's a great question! Let me help you practice that scenario.",
        "I understand you want to work on that skill. Let's try a role-play exercise.",
        "Excellent! Your communication style shows confidence. Try to add more specific examples.",
        "I notice you could improve your active listening. Try paraphrasing what you hear.",
        "Your body language awareness is developing well. Keep practicing eye contact."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({
        response: randomResponse,
        suggestions: [
          "Try speaking more slowly for clarity",
          "Use open body language",
          "Ask clarifying questions"
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
