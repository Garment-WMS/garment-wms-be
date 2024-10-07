import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductTypeService } from '../product-type.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductTypeExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productTypeService: ProductTypeService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const productType = await this.productTypeService.findById(value);
    return !!productType;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product type doesn't exist";
  }
}

export function IsProductTypeExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductTypeExistValidator,
      async: true,
    });
  };
}
