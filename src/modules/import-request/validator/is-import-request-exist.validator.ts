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
export class IsImportRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly importRequestService: ImportRequestService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const isExist = await this.importRequestService.findFirst(value);
    return !!isExist;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Import request doesn't exist";
  }
}

export function IsImportRequestExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsImportRequestExistValidator,
      async: true,
    });
  };
}
