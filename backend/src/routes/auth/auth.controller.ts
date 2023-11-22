import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto, @Req() req) {
    return this.authService.login(body, req);
  }
}
