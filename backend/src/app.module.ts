import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './routes/auth/auth.module';
@Module({
  imports: [AuthModule, PrismaModule],
})
export class AppModule {}
