import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, closeConnections } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import technologyRoutes from './routes/technologies';
import auctionRoutes from './routes/auctions';
import categoryRoutes from './routes/categories';
import { ApiResponse } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    const response: ApiResponse = {
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
      }
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Health check failed'
    };
    res.status(500).json(response);
  }
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/technologies`, technologyRoutes);
app.use(`/api/${API_VERSION}/auctions`, auctionRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      message: 'HANOTEX API Server',
      version: API_VERSION,
      documentation: `/api/${API_VERSION}/docs`,
      health: '/health'
    }
  };
  res.json(response);
});

// 404 handler
app.use('*', (req, res) => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  const response: ApiResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Something went wrong'
  };
  
  res.status(error.status || 500).json(response);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await closeConnections();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await closeConnections();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('🚀 HANOTEX API Server started successfully!');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/${API_VERSION}/docs`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;

