import { Injectable } from '@nestjs/common';
import { User, UserSessions } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  /**
   * Retrieves the sessions for a user (or the current user)
   * @param {User} user The current user
   * @returns {Partial<UserSessions>[]} The user's sessions
   */
  getSessions(user: User): Promise<Partial<UserSessions>[]> {
    return this.prisma.userSessions.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
      },
    });
  }

  /**
   * Retrieves a session by id for a user (or the current user)
   * @param {User} user The current user
   * @param {number} sessionId The session ID to retrieve
   * @returns {Partial<UserSessions>} The user's session
   */
  getSession(user: User, sessionId: number): Promise<Partial<UserSessions>> {
    return this.prisma.userSessions.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
      },
    });
  }
}
