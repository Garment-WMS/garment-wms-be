import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  IsEmailCustom,
  IsEnumCustom,
  IsNotEmptyCustom,
  IsPhoneNumberCustom,
  IsStringCustom,
  MinLengthCustom,
} from 'src/common/decorator/class-validator-custom.decorator';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class SignUpDTO {
  @ApiProperty({
    type: String,
    description: 'Email of the user',
    required: true,
    example: 'nguyenphigv23@gmail.com',
    pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
  })
  @IsNotEmptyCustom()
  @IsEmailCustom()
  email: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsPhoneNumberCustom()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  password: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @MinLengthCustom(1)
  @IsStringCustom()
  firstName: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  lastName: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  username: string;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmptyCustom()
  @IsEnumCustom(Gender)
  gender: Gender;

  // @IsNotEmpty()
  // @ValidateNested()
  // @Type(() => CidDTO)
  // cid: CidDTO;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  cidId?: string;
}
