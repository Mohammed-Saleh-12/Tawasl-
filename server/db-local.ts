import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

console.log("🔗 Connecting to local database...");

let pool: Pool | null = null;
let db: any = null;

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using in-memory storage for development.");
} else {
  try {
    pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for local development
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

    db = drizzle({ client: pool, schema });

// Database connection is ready
console.log("✅ Database connection configured!"); 
  } catch (error) {
    console.warn("⚠️  Database connection failed. Using in-memory storage for development.");
    console.error("Database error:", error);
    pool = null;
    db = null;
  }
}

export { pool, db }; 