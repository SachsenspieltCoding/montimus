import { Module } from '@nestjs/common';
import { HistoryCleanupJob } from './historyCleanup.service';
import { SessionCleanupJob } from './sessionCleanup.service';

@Module({
  providers: [SessionCleanupJob, HistoryCleanupJob],
})
export class JobsModule {}
