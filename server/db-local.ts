import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

console.log("🔗 Connecting to local database...");

let pool: Pool;
let db: any;

// Test the connection
const testConnection = async () => {
  try {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL || "postgresql://tawasl_user:tawasl_password@localhost:5432/tawasl",
      ssl: false // Disable SSL for local development
    });
    
    await pool.query('SELECT NOW()');
    console.log("✅ Local database connection successful!");
    db = drizzle(pool, { schema });
    return db;
  } catch (error: any) {
    console.error("❌ Local database connection failed:", error.message);
    throw error;
  }
};

// Initialize the connection and export
testConnection().then(() => {
  console.log("✅ Database initialized successfully!");
}).catch((error) => {
  console.error("❌ Failed to initialize database:", error);
});

export { db, pool }; 
