import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmailCustom,
  IsNotEmptyCustom,
  IsURLCustom,
} from 'src/common/decorator/class-validator-custom.decorator';

export class SendResetPasswordDTO {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsEmailCustom()
  email: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsURLCustom()
  clientUrl: string;
}
