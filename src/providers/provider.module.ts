import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from '@/providers/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options)],
  providers: [],
})
export class ProviderModule {}
