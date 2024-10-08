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
  landLordId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  renterId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  managerId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  staffId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  adminId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  technicalStaffId: string;
}
