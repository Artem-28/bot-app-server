import { IsDefined, IsEmail, IsNumber } from 'class-validator';

export class ChangeOwnerBodyDto {
  @IsDefined()
  @IsEmail()
  owner_email: string;
}

export class ChangeOwnerDto extends ChangeOwnerBodyDto {
  @IsDefined()
  @IsNumber()
  project_id: number;
}
