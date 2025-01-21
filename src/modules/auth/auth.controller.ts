import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SignUpDto } from '@/modules/auth/dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
