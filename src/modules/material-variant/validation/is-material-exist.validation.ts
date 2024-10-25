import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialService } from 'src/modules/material/material.service';
import { MaterialVariantService } from '../material-variant.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly materialVariantService: MaterialVariantService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const material = await this.materialVariantService.findById(value);
    return !!material;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Material doesn't exist";
  }
}

export function IsMaterialExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMaterialExistValidator,
      async: true,
    });
  };
}
