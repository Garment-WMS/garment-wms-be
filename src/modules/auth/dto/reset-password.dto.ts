import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmptyCustom,
  IsStringCustom,
} from 'src/common/decorator/class-validator-custom.decorator';

export class ResetPasswordDTO {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  token: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  newPassword: string;
}
