import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MontimusError } from 'src/common/errorCodes';
import { UserService } from './user.service';

@Controller('user/:userId?')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: 'The currently logged in user gets returned' })
  @ApiTags('Users')
  async getUser(@CurrentUser() user: User) {
    return this.userService.partial(user);
  }

  @Get('sessions')
  @ApiOkResponse({ description: 'The current sessions of the user gets returned' })
  @ApiTags('Users')
  getSessions(@CurrentUser() user: User) {
    return this.userService.getSessions(user);
  }

  @Get('sessions/:sessionId')
  @ApiOkResponse({ description: 'The requested session gets returned' })
  @ApiNotFoundResponse({ description: 'The requested session does not exist' })
  @ApiTags('Users')
  async getSession(@CurrentUser() user: User, @Param('sessionId') sessionId: string) {
    if (isNaN(Number(sessionId))) throw new BadRequestException('Invalid session ID');
    const session = await this.userService.getSession(user, Number(sessionId));
    if (!session) throw new NotFoundException(MontimusError.SESSION_NOT_FOUND.toJSON());
    return session;
  }

  @Get('sessions/:sessionId/revoke')
  @ApiOkResponse({ description: 'The requested session was revoked' })
  @ApiNotFoundResponse({ description: 'The requested session does not exist' })
  @ApiTags('Users')
  async revokeSession(@CurrentUser() user: User, @Param('sessionId') sessionId: string) {
    if (isNaN(Number(sessionId))) throw new BadRequestException('Invalid session ID');
    const session = await this.userService.getSession(user, Number(sessionId));
    if (!session) throw new NotFoundException(MontimusError.SESSION_NOT_FOUND.toJSON());
    return { revoked: await this.userService.revokeSession(user, session.id) };
  }
}
