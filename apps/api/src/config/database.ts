import { Pool, PoolConfig } from 'pg';
import { createClient, RedisClientType } from 'redis';

// Database configuration
const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'hanotex',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Log database configuration
console.log('🔧 Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password ? '***' : 'undefined'
});

// Create PostgreSQL connection pool
export const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Redis configuration
let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
  }
  return redisClient;
};

// Graceful shutdown
export const closeConnections = async (): Promise<void> => {
  try {
    await pool.end();
    if (redisClient) {
      await redisClient.quit();
    }
    console.log('✅ Database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

// Database query helper
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

