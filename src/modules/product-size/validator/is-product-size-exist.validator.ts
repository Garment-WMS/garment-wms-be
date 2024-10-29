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
export class IsProductSizeExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productSizeService: ProductSizeService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;

    const productSize = await this.productSizeService.findById(value);
    return !!productSize;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product size doesn't exist";
  }
}

export function IsProductSizeExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductSizeExistValidator,
      async: true,
    });
  };
}
