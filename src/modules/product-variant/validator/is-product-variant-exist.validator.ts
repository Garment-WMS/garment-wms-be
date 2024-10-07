import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductVariantService } from '../product-variant.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductVariantExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productVariantService: ProductVariantService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;

    const productVariant = await this.productVariantService.findById(value);
    return !!productVariant;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product Variant doesn't exist";
  }
}

export function IsProductVariantExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductVariantExistValidator,
      async: true,
    });
  };
}
