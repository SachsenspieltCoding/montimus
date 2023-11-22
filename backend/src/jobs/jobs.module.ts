import { Module } from '@nestjs/common';
import { SessionCleanupJob } from './sessionCleanup.service';

@Module({
  providers: [SessionCleanupJob],
})
export class JobsModule {}
