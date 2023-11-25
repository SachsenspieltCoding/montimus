import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthGuard } from './common/guards/auth.guard';
import { CryptoModule } from './crypto/crypto.module';
import { JobsModule } from './jobs/jobs.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './routes/auth/auth.module';
import { MonitoringRESTModule } from './routes/monitoring/monitoring.module';
import { UserModule } from './routes/user/user.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    CryptoModule,
    UserModule,
    JobsModule,
    MonitoringModule,
    MonitoringRESTModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
