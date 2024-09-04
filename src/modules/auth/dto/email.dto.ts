import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmailCustom,
  IsNotEmptyCustom,
} from 'src/common/decorator/class-validator-custom.decorator';

export class EmailDTO {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsEmailCustom()
  email: string;
}
