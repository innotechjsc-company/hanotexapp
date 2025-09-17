const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'hanotex',
  user: 'postgres',
  password: '123456',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false,
};

console.log('🔧 Testing database connection with config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password ? '***' : 'undefined'
});

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔄 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');
    console.log('📊 Query result:', result.rows[0]);
    
    client.release();
    await pool.end();
    console.log('✅ Connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Error details:', error);
    await pool.end();
    return false;
  }
};

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
