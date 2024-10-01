import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMaterialTypeDto implements Prisma.MaterialTypeCreateInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Material Type Name', example: 'Fabric' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Material Type Code', example: 'F0001' })
  code: string;
}