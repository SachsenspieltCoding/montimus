import bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password The password to hash
 * @returns The hashed password
 */
export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

/**
 * Compares a password to a hash
 * @param password The password to compare
 * @param hash The hash to compare against
 * @returns Whether the password matches the hash
 */
export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
