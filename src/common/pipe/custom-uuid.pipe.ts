import {
  BadRequestException,
  ParseUUIDPipe,
  ParseUUIDPipeOptions,
} from '@nestjs/common';

export class CustomUUIDPipe extends ParseUUIDPipe {
  //change message to vietnamese
  constructor(options?: ParseUUIDPipeOptions) {
    super({
      errorHttpStatusCode: 400,
      exceptionFactory: () => new BadRequestException('UUID không hợp lệ'),
      ...options,
    });
  }
}
