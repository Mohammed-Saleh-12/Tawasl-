import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://tawasl_user:tawasl_password@localhost:5433/tawasl',
  ssl: false
});

async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    const result = await pool.query('SELECT NOW() as current_time, current_user, current_database()');
    console.log('✅ Connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('Current user:', result.rows[0].current_user);
    console.log('Current database:', result.rows[0].current_database);
    
    // Test if tables exist
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('📊 Tables found:', tables.rows.map(row => row.table_name));
    
    // Test data
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Users count:', users.rows[0].count);
    
    const articles = await pool.query('SELECT COUNT(*) as count FROM articles');
    console.log('📝 Articles count:', articles.rows[0].count);
    
    const faqs = await pool.query('SELECT COUNT(*) as count FROM faqs');
    console.log('❓ FAQs count:', faqs.rows[0].count);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection(); 