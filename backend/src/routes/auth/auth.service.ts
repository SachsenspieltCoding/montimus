import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MontimusError } from 'src/common/errorCodes';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import LoginDto from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
    private userService: UserService,
  ) {}

  async login(dto: LoginDto, req: Request) {
    const { username, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new ForbiddenException(MontimusError.WRONG_USERNAME_OR_PASSWORD.toJSON());
    }

    const passwordMatch = this.crypto.compareHashSync(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException(MontimusError.WRONG_USERNAME_OR_PASSWORD.toJSON());
    }

    const session = await this.prisma.userSessions.create({
      data: {
        userId: user.id,
        name: `${req.ip} - ${req.headers['user-agent']}`,
        jwt: this.crypto.generateJwt(user),
      },
    });

    return { user: this.userService.partial(user), session };
  }
}
