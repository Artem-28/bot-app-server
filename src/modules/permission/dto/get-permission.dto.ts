import { IsDefined, IsNumber } from 'class-validator';

export class GetPermissionDto {
  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDefined()
  @IsNumber()
  user_id: number;
}
