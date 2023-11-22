import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Public, Unauthenticated } from 'src/common/decorators/public.decorator';
import { MontimusError } from 'src/common/errorCodes';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { MONTIMUS_SESSION_TOKEN } = request.cookies;

    const token = MONTIMUS_SESSION_TOKEN || request.headers['authorization']?.split(' ')[1];

    const isPublic = this.reflector.get(Public, context.getHandler());
    const isUnauthenticatedOnly = this.reflector.get(Unauthenticated, context.getHandler());

    if (isPublic && !token) return true;

    if (!token) throw new UnauthorizedException(MontimusError.MISSING_AUTH_TOKEN.toJSON());

    if (isUnauthenticatedOnly) throw new UnauthorizedException(MontimusError.ALREADY_AUTHENTICATED.toJSON());

    const decoded = await this.jwtService.decode(token);

    if (!decoded) throw new UnauthorizedException(MontimusError.INVALID_AUTH_TOKEN.toJSON());

    const session = await this.prisma.userSessions.findFirst({
      where: { jwt: token },
      include: { user: true },
    });

    if (!session) throw new UnauthorizedException(MontimusError.INVALID_AUTH_TOKEN.toJSON());

    if (session.expiresAt < new Date()) {
      await this.prisma.userSessions.delete({ where: { id: session.id } });
      throw new UnauthorizedException(MontimusError.EXPIRED_AUTH_TOKEN.toJSON());
    }

    if (!session.user) throw new UnauthorizedException(MontimusError.UNAUTHORIZED.toJSON());

    request.user = session.user;

    return true;
  }
}
