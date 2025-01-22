import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from '@/providers/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig, JwtStrategy } from '@/providers/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    JwtModule.register(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy],
})
export class ProviderModule {}
