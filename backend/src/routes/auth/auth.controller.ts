import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public, Unauthenticated } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import LoginDto from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('test')
  test() {
    return [(+process.env.MAX_SESSION_AGE || 30) * 1000 * 60 * 60 * 24, +process.env.MAX_SESSION_AGE || 30];
  }

  @Post('login')
  @Public()
  @Unauthenticated()
  login(@Body() body: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(body, req, res);
  }
}
