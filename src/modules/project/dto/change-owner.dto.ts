import { IsDefined, IsEmail, IsNumber } from 'class-validator';

export class ChangeOwnerBodyDto {
  @IsDefined()
  @IsEmail()
  ownerEmail: string;
}

export class ChangeOwnerDto extends ChangeOwnerBodyDto{
  @IsDefined()
  @IsNumber()
  projectId: number;
}
