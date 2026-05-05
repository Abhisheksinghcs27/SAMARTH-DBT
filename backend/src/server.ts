import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import verificationRoutes from './routes/verification';
import grievanceRoutes from './routes/grievances';
import trackingRoutes from './routes/tracking';
import aiRoutes from './routes/ai';
import uploadRoutes from './routes/uploads';
import path from 'path';
import { validateEnv, getEnvConfig } from './utils/env';

dotenv.config();

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Environment validation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}

const env = getEnvConfig();
const app = express();
const PORT = env.PORT;

// Middleware
const corsOptions = {
  origin: env.CORS_ORIGIN 
    ? env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : env.NODE_ENV === 'production'
      ? ['https://samarth-dbt.onrender.com'] // Allowed in production if not explicitly set
      : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  // Only add security headers in production
  if (env.NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', uploadRoutes);

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log errors in all environments, but with different detail levels
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('Error:', err);
  } else {
    // In production, log minimal info
    const error = err instanceof Error ? err : new Error('Unknown error');
    // eslint-disable-next-line no-console
    console.error('Error:', error.message);
  }
  
  // Type guard for Error objects
  if (!(err instanceof Error)) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const mongooseErr = err as any;
    return res.status(400).json({
      error: 'Validation Error',
      details: mongooseErr.errors ? Object.values(mongooseErr.errors).map((e: any) => e.message) : [err.message],
    });
  }

  // Mongoose duplicate key error
  const mongooseErr = err as any;
  if (mongooseErr.code === 11000) {
    const field = mongooseErr.keyPattern ? Object.keys(mongooseErr.keyPattern)[0] : 'field';
    return res.status(400).json({
      error: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
    });
  }

  // Multer errors
  if (err.name === 'MulterError') {
    const multerErr = err as any;
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
      });
    }
    if (multerErr.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
      });
    }
    return res.status(400).json({
      error: err.message || 'File upload error',
    });
  }

  // Default error
  const statusErr = err as any;
  res.status(statusErr.status || statusErr.statusCode || 500).json({
    error: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const server = app.listen(PORT, () => {
      if (env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`🚀 Server running on port ${PORT}`);
        // eslint-disable-next-line no-console
        console.log(`📡 API available at http://localhost:${PORT}/api`);
        // eslint-disable-next-line no-console
        console.log(`💚 Health check: http://localhost:${PORT}/health`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${PORT} (${env.NODE_ENV})`);
      }
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
        console.error(`\n❌ Port ${PORT} is already in use!`);
      if (env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`\n💡 Solutions:`);
        // eslint-disable-next-line no-console
        console.error(`   1. Kill the process using port ${PORT}:`);
        // eslint-disable-next-line no-console
        console.error(`      lsof -ti:${PORT} | xargs kill -9`);
        // eslint-disable-next-line no-console
        console.error(`   2. Or use a different port by setting PORT in .env file`);
        // eslint-disable-next-line no-console
        console.error(`      PORT=5001 npm run dev\n`);
      }
        process.exit(1);
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to start server:', error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', errorMessage);
    process.exit(1);
  }
};

startServer();
