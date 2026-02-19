import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
    userId: string;
  };
};
