import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ImportRequestService } from '../import-request.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsImportRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly importRequestService: ImportRequestService) {}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    throw new Error('Method not implemented.');
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new Error('Method not implemented.');
  }
}

export function IsImportRequestExist() {
  return function (object: object, propertyName: string) {
    throw new Error('Method not implemented.');
  };
}
