import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductUomService } from '../product-uom.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductUomExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productUomService: ProductUomService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const productUom = await this.productUomService.findById(value);
    return !!productUom;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product Uom doesn't exist";
  }
}

export function IsProductUomExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductUomExistValidator,
      async: true,
    });
  };
}
