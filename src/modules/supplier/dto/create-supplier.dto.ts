import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  supplierName: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  supplierCode: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsPhoneNumber()
  fax: string;
}
