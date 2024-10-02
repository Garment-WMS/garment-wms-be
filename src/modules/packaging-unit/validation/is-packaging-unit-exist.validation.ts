import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PackagingUnitService } from '../packaging-unit.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsPackagingUnitExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly packagingService: PackagingUnitService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const packagingUnit = await this.packagingService.findById(value);
    return !!packagingUnit;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Packaging unit doesn't exist";
  }
}

export function IsPackagingUnitExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPackagingUnitExistValidator,
      async: true,
    });
  };
}
