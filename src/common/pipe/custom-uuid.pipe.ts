import {
  BadRequestException,
  ParseUUIDPipe,
  ParseUUIDPipeOptions,
} from '@nestjs/common';

export class CustomUUIDPipe extends ParseUUIDPipe {
  constructor(options?: ParseUUIDPipeOptions) {
    super({
      errorHttpStatusCode: 400,
      exceptionFactory: () => new BadRequestException('UUID is invalid'),
      ...options,
    });
  }
}
