import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class FilterDto<T> {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  field: keyof T;

  @IsDefined()
  @IsNotEmpty()
  value: string | number;
}
