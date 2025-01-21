import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
