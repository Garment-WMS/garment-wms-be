import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ImportRequestService } from '../import-request.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsPoDeliveryDoesNotHaveActiveImportRequestValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly importRequestService: ImportRequestService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const activeImportRequest =
      await this.importRequestService.getActiveImportReqOfPoDelivery(value);
    return !activeImportRequest;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'PO delivery already have active import request';
  }
}

export function IsPoDeliveryDoesNotHaveActiveImportRequest() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsPoDeliveryDoesNotHaveActiveImportRequestValidator,
      async: true,
    });
  };
}
