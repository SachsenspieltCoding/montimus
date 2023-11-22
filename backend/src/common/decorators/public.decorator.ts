import { Reflector } from '@nestjs/core';

/**
 * Decorator to mark a route as public
 */
export const Public = Reflector.createDecorator<undefined>();

/**
 * Decorator to mark a route as only accessible by unauthenticated users
 */
export const Unauthenticated = Reflector.createDecorator<undefined>();
