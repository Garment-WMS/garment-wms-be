import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDefectDto implements Prisma.DefectCreateInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
