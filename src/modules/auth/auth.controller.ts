import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto, SignInDto } from '@/modules/auth/dto';
import { AuthDataService } from '@/modules/auth-data/auth-data.service';
import { UserService } from '@/modules/user/user.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    readonly authDataService: AuthDataService,
    readonly userService: UserService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authDataService.signUp(body);
    return this.userService.create(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return await this.userService.getOne({ field: 'email', value: body.email }, true);
  }
}
