import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class SendResetPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  clientUrl: string;
}
