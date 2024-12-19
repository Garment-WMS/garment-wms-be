import { ConflictException } from '@nestjs/common';

export class NotEnoughQuantityException extends ConflictException {
  constructor(notEnoughMaterialVariantIds: string[]) {
    super('Not enough quantity');
    this.message = `Not enough quantity for material variants with IDs: ${notEnoughMaterialVariantIds.join(', ')}`;
  }
}
