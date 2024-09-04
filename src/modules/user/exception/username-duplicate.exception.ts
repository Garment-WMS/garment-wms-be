import { HttpException } from '@nestjs/common';

export class UsernameDuplicateException extends HttpException {
  constructor() {
    super('Username already exists', 400);
  }
}
