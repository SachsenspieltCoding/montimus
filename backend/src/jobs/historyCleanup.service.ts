import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryCleanupJob {
  private readonly logger = new Logger(HistoryCleanupJob.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupHistory() {
    const histories = await this.prisma.monitorHistory.findMany();
    const maxHistoricalDays = Number(process.env.MAX_HISTORY_AGE) || 90;
    const historiesToDelete = histories.filter(
      (session) => session.createdAt < new Date(Date.now() - maxHistoricalDays * 24 * 60 * 60 * 1000),
    );

    const deleted = await this.prisma.monitorHistory.deleteMany({
      where: {
        id: {
          in: historiesToDelete.map((history) => history.id),
        },
      },
    });

    this.logger.log(`Deleted ${deleted.count} histories`);
  }
}
