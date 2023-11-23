import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MontimusError } from 'src/common/errorCodes';
import { UserService } from './user.service';

@Controller('user/:userId?')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('sessions')
  getSessions(@CurrentUser() user: User) {
    return this.userService.getSessions(user);
  }

  @Get('sessions/:sessionId')
  async getSession(@CurrentUser() user: User, @Param('sessionId') sessionId: string) {
    if (isNaN(Number(sessionId))) throw new BadRequestException('Invalid session ID');
    const session = await this.userService.getSession(user, Number(sessionId));
    if (!session) throw new NotFoundException(MontimusError.SESSION_NOT_FOUND.toJSON());
    return session;
  }
}
