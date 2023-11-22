import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupSessions() {
    const sessions = await this.prisma.userSessions.findMany();
    const sessionsToDelete = sessions.filter((session) => session.expiresAt < new Date());

    const deleted = await this.prisma.userSessions.deleteMany({
      where: {
        id: {
          in: sessionsToDelete.map((session) => session.id),
        },
      },
    });

    this.logger.log(`Deleted ${deleted.count} expired sessions`);
  }
}
