import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  /**
   * Returns a partial user object to be sent to the client
   * @param {User} user The user to return
   * @returns {Partial<User>} The partial user object
   */
  partial(user: User): Partial<User> {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
