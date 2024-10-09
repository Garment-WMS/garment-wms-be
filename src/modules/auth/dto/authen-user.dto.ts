import { ApiProperty } from '@nestjs/swagger';
import { RoleCode, User } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
export class AuthenUser {
  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  @IsEnum(RoleCode)
  role: RoleCode;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  warehouseStaffId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  warehouseManagerId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  purchasingStaffId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  inspectionDepartmentId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productionDepartmentId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  facoryDirectorId: string;
}
