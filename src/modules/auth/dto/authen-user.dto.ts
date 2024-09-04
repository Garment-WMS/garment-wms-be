import { ApiProperty } from '@nestjs/swagger';
import { RoleCode, User } from '@prisma/client';
import { IsOptional } from 'class-validator';
import {
  IsEnumCustom,
  IsUUIDCustom,
} from 'src/common/decorator/class-validator-custom.decorator';
export class AuthenUser {
  @ApiProperty()
  @IsUUIDCustom()
  accountId: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  @IsEnumCustom(RoleCode)
  role: RoleCode;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  @IsOptional()
  landLordId: string;

  @ApiProperty()
  @IsOptional()
  renterId: string;

  @ApiProperty()
  @IsOptional()
  managerId: string;

  @ApiProperty()
  @IsOptional()
  staffId: string;

  @ApiProperty()
  @IsOptional()
  adminId: string;

  @ApiProperty()
  @IsOptional()
  technicalStaffId: string;
}
