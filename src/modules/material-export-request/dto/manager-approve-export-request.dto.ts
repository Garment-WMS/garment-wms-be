import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ManagerAction } from 'src/modules/import-request/dto/import-request/manager-process.dto';

export class ManagerApproveExportRequestDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ManagerAction)
  action: ManagerAction;

  @ApiProperty({ required: false })
  @IsString()
  managerNote: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  warehouseStaffId: string;
}
