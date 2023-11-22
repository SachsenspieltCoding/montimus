import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
@Module({
  imports: [AuthModule, PrismaModule, CryptoModule, UserModule],
})
export class AppModule {}
