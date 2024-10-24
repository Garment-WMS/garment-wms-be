import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialService } from '../material.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialTypeExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly materialService: MaterialService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const materialType = await this.materialService.findById(value);
    return !!materialType;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Material type doesn't exist";
  }
}

export function IsMaterialTypeExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMaterialTypeExistValidator,
      async: true,
    });
  };
}
