import { ApiProperty } from '@nestjs/swagger';

export class Logout {
  @ApiProperty()
  refreshToken: string;
}
