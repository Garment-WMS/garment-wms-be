import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ImportReceiptService } from '../import-receipt.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialReceiptBelongToImportReceiptValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly importReceiptService: ImportReceiptService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const isExist = await this.importReceiptService.findUnique(value);
    return !!isExist;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Import request doesn't exist";
  }
}

export function IsMaterialReceiptBelongToImportReceipt(importReceiptId) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [importReceiptId],
      validator: IsMaterialReceiptBelongToImportReceiptValidator,
      async: true,
    });
  };
}
