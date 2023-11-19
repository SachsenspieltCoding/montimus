import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  //   constructor(private authService: AuthService) {}

  @Get('test')
  test() {
    return 'Auth route working';
  }
}
