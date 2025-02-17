import { IsDefined, IsNumber } from 'class-validator';

export class GetPermissionDto {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsNumber()
  userId: number;
}
