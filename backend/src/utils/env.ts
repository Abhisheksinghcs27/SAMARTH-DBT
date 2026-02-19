/**
 * Environment variable validation and helpers
 */

interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  GEMINI_API_KEY: string;
  MAX_FILE_SIZE: number;
  UPLOAD_DIR: string;
  CORS_ORIGIN: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
] as const;

/**
 * Validates required environment variables
 * @throws Error if any required variable is missing
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file in the backend directory.`
    );
  }

  // Validate JWT_SECRET strength in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error(
        'JWT_SECRET must be at least 32 characters long in production. ' +
        'Please generate a stronger secret key.'
      );
    }
  }
}

/**
 * Get validated environment configuration
 */
export function getEnvConfig(): EnvConfig {
  validateEnv();

  return {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
    UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  };
}
