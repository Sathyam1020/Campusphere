// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'college' | 'student' | 'teacher' | 'recruiter';
}

export function generateToken(payload: TokenPayload): string {
  console.log('🔨 Generating token for:', payload.email, 'type:', payload.type);
  console.log('🔨 JWT Secret exists:', !!JWT_SECRET);
  
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'your-app-name',
  });
  
  console.log('✅ Token generated successfully:', token.substring(0, 50) + '...');
  return token;
}

export function verifyToken(token: string): TokenPayload {
  try {
    console.log('🔐 Verifying token:', token.substring(0, 50) + '...');
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'your-app-name',
    }) as TokenPayload;
    console.log('✅ Token verification successful for:', payload.email);
    return payload;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    console.error('❌ JWT Secret exists:', !!JWT_SECRET);
    console.error('❌ Token preview:', token.substring(0, 100));
    throw new Error('Invalid or expired token');
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}