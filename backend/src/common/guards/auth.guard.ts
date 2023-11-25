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
    const response = context.switchToHttp().getResponse();

    function error(err: MontimusError): void {
      response.cookie('MONTIMUS_SESSION_TOKEN', '', { maxAge: 0 });
      throw new UnauthorizedException(err.toJSON());
    }

    const { MONTIMUS_SESSION_TOKEN } = request.cookies;

    const token = MONTIMUS_SESSION_TOKEN || request.headers['authorization']?.split(' ')[1];

    const isPublic = this.reflector.get(Public, context.getHandler());
    const isUnauthenticatedOnly = this.reflector.get(Unauthenticated, context.getHandler());

    if (isPublic && !token) return true;

    if (!token) error(MontimusError.MISSING_AUTH_TOKEN);

    if (isUnauthenticatedOnly) error(MontimusError.ALREADY_AUTHENTICATED);

    const decoded = await this.jwtService.decode(token);

    if (!decoded) error(MontimusError.INVALID_AUTH_TOKEN);

    const session = await this.prisma.userSessions.findFirst({
      where: { jwt: token },
      include: { user: true },
    });

    if (!session) error(MontimusError.SESSION_NOT_FOUND);

    if (session.expiresAt < new Date()) {
      await this.prisma.userSessions.delete({ where: { id: session.id } });
      error(MontimusError.EXPIRED_AUTH_TOKEN);
    }

    if (!session.user) error(MontimusError.UNAUTHORIZED);

    request.user = session.user;

    return true;
  }
}
