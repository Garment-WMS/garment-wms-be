import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ManagerAction {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ManagerProcessDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ManagerAction)
  action: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  approveNote?: string;

  @ApiProperty({ required: false })
  rejectAt?: string | Date;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  rejectReason?: string;

  constructor() {
    this.rejectAt =
      this.action === ManagerAction.REJECTED ? new Date() : undefined;
  }
}
