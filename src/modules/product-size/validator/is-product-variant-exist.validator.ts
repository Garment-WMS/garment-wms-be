import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductSizeService } from '../product-size.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductVariantExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productSizeService: ProductSizeService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;

    const productVariant = await this.productSizeService.findById(value);
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
