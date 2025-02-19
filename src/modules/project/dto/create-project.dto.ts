import { IsDefined, IsString } from 'class-validator';
import { UserAggregate } from '@/models/user';

export class CreateProjectBodyDto {
  @IsDefined()
  @IsString()
  title: string;
}

export class CreateProjectDto extends CreateProjectBodyDto {
  @IsDefined()
  owner: UserAggregate;
}
