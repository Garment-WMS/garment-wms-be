import { ConflictException } from '@nestjs/common';

export class NotEnoughQuantityException extends ConflictException {
  constructor() {
    super('Not enough quantity');
  }
}
