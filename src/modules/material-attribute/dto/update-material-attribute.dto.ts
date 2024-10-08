import { IsOptional, IsString } from 'class-validator';

export class UpdateMaterialAttributeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  value: any;
}
