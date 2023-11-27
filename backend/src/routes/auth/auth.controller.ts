import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public, Unauthenticated } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import LoginDto from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @Unauthenticated()
  @ApiCreatedResponse({ description: 'The user has been successfully logged in.' })
  @ApiForbiddenResponse({ description: 'Wrong username or password' })
  @ApiTags('Auth')
  login(@Body() body: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(body, req, res);
  }
}
