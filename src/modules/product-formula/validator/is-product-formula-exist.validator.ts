import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductFormulaService } from '../product-formula.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductFormulaExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly productFormulaService: ProductFormulaService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const productFormula = await this.productFormulaService.findById(value);
    return !!productFormula;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Product formula doesn't exist";
  }
}

export function IsProductFormulaExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductFormulaExistValidator,
      async: true,
    });
  };
}
