import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto, SignInDto } from '@/modules/auth/dto';
import { AuthDataService } from '@/modules/auth-data/auth-data.service';
import { UserService } from '@/modules/user/user.service';
import { JwtGuard } from '@/providers/jwt';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    readonly authDataService: AuthDataService,
    readonly userService: UserService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authDataService.signUp(body);
    await this.userService.create(body);
    return true;
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return await this.authDataService.signIn(body, true);
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  public async logout(@Req() req) {
    return await this.authDataService.removeToken(req.authData.id);
  }

  @Get('user')
  @UseGuards(JwtGuard)
  public async user(@Req() req) {
    return req.user;
  }
}
