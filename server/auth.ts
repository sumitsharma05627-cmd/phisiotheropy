import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

// In-memory token store for active admin sessions.
// Cryptographically secure, random 256-bit session tokens.
// Requires NO environment variable or persistent secret key.
interface SessionData {
  userId: number;
  username: string;
  role: string;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();

export function hashPassword(plainText: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
}

export function comparePassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function generateToken(payload: { userId: number; username: string; role: string }): string {
  // Generate a cryptographically strong 32-byte (256-bit) random hex token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  activeSessions.set(token, {
    userId: payload.userId,
    username: payload.username,
    role: payload.role,
    expiresAt,
  });

  return token;
}

export function verifyToken(token: string): { userId: number; username: string; role: string } | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
  };
}

export interface AuthRequest extends Request {
  user?: { userId: number; username: string; role: string };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  req.user = decoded;
  next();
}
