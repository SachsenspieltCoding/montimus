import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  constructor(private jwtService: JwtService) {}

  /**
   * Hashes synchronously a string using bcrypt
   * @param {string} string The string to hash
   * @returns {string} The hashed string
   */
  hashSync(string: string): string {
    // const salt = crypto.randomBytes(16).toString('hex');
    // const hash = crypto.scryptSync(string, salt, 1000).toString('hex');
    // return `${hash}:${salt}`;

    return bcrypt.hashSync(string, 10);
  }

  /**
   * Compares a string to a hash synchronously using bcrypt
   * @param {string} string The string to compare against the hash
   * @param {string} hash The hash to compare against the string
   * @returns {boolean} Whether the string matches the hash
   */
  compareHashSync(string: string, hash: string): boolean {
    // const [hashedString, salt] = hash.split(':');
    // const hashedInput = crypto.scryptSync(string, salt, 1000).toString('hex');
    // return hashedString === hashedInput;
    if (!string || !hash) return false;
    return bcrypt.compareSync(string, hash);
  }

  /**
   * Generates a JWT for a user
   * @param {Partial<User>} user The user to generate the JWT for
   * @param {number} expiresIn (optional) The time in seconds for the JWT to expire
   * @returns {string} The JWT
   */
  generateJwt(user: Partial<User>, expiresIn?: number): string {
    return this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: expiresIn || 60 * 60 * 24 * 30, // 30 days by default
      },
    );
  }
}
