import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialPackageService } from '../material-package.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialPackageExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly materialPackageService: MaterialPackageService,
  ) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const materialPackage = await this.materialPackageService.findById(value);
    return !!materialPackage;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Material package doesn't exist";
  }
}

export function IsMaterialPackageExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMaterialPackageExistValidator,
      async: true,
    });
  };
}
