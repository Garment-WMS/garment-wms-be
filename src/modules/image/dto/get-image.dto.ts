import { ApiProperty } from '@nestjs/swagger';
import { PathConstants } from 'src/common/constant/path.constant';

export class GetImageDto {
  @ApiProperty({
    description: 'The ID of the object',
    example: '4e9b70d1-e83b-46e6-9da8-17014b7e2e2e',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the file',
    example: '1722927305956-4d7a6fa6fabd931a57161c7b1bb8f725.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'The input path',
    example: `${PathConstants.USER_PATH}`,
  })
  pathInput: string;
}
