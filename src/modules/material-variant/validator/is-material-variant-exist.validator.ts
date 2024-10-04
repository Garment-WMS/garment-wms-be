import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialVariantService } from '../material-variant.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialVariantExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly materialVariantService: MaterialVariantService,
  ) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const materialVariant = await this.materialVariantService.findById(value);
    return !!materialVariant;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Material variant doesn't exist";
  }
}

export function IsMaterialVariantExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMaterialVariantExistValidator,
      async: true,
    });
  };
}
