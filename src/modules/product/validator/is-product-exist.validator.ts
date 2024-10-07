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
export class IsProductExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly productSerice: ProductService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;

    const product = await this.productSerice.findById(value);
    return !!product;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product doesn't exist";
  }
}

export function IsProductExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductExistValidator,
      async: true,
    });
  };
}
