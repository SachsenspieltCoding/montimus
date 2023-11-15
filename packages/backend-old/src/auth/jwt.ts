import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

/**
 * Create a JWT token for a user
 * @param user The user to create a token for
 * @returns The token
 */
export function createUserToken(user: User) {
  if (!secret) {
    throw new Error('JWT secret not set');
  }

  return jwt.sign({ id: user.id }, secret);
}

/**
 * Verify a JWT token
 * @param token The token to verify
 * @param callback The callback to call when the token is verified
 * @returns The decoded token
 */
export function verifyUserToken(token: string, callback: (err: any, decoded: any) => void) {
  if (!secret) {
    throw new Error('JWT secret not set');
  }

  return jwt.verify(token, secret, callback);
}
