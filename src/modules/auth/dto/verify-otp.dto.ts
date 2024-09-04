import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsEmailCustom,
  IsStringCustom,
  MaxLengthCustom,
  MinLengthCustom,
} from 'src/common/decorator/class-validator-custom.decorator';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class VerifyOtpDTO {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;

  @ApiProperty()
  @IsStringCustom()
  @MinLengthCustom(6)
  @MaxLengthCustom(6)
  otp: string;
}
