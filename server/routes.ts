import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { Router } from 'express';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

const router = Router();

// Zod schemas for input validation
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const articleSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

const testResultSchema = z.object({
  categoryId: z.number(),
  score: z.number(),
  answers: z.array(z.any()), // Adjust as needed for your answer structure
});

// Health check endpoint
router.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test session endpoint for development
router.get('/test-session', (req, res) => {
  try {
  console.log('🧪 Test session - Session data:', req.session);
  res.json({ 
    session: req.session,
    hasUserId: !!req.session.userId,
    userId: req.session.userId,
    environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Test session error:', error);
    res.status(500).json({ error: 'Session test failed' });
  }
});

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

export function registerRoutes(app: Express): Promise<Server> {
  return new Promise((resolve) => {
    app.use('/api', router);
    
    const server = createServer(app);
    resolve(server);
  });
}