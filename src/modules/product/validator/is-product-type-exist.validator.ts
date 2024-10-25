import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductService } from '../product.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductTypeExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productService: ProductService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const productType = await this.productService.findById(value);
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
