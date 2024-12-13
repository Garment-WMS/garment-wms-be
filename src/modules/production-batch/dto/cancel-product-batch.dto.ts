import { ApiProperty } from '@nestjs/swagger';
import { $Enums, RoleCode } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CancelProductBatchDto {
  // canceledAt?: string | Date = new Date();

  // @ApiProperty({ required: true })
  // @IsUUID()
  // @IsUserRoleExist(RoleCode.PRODUCTION_DEPARTMENT)
  // canceledBy: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  cancelledReason: string;

  // @ApiProperty({ required: true })
  // @IsEnum($Enums.ProductionBatchStatus)
  // status?: $Enums.ProductionBatchStatus;
}
