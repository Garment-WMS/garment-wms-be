import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UomService } from '../uom.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUomExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly uomSevice: UomService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const uom = await this.uomSevice.findById(value);
    return !!uom;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Unit of measure doesn't exist";
  }
}

export function IsUomExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUomExistValidator,
      async: true,
    });
  };
}
