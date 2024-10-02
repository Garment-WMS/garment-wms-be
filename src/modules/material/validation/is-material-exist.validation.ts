import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MaterialService } from '../material.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMaterialExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly materialService: MaterialService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const material = await this.materialService.findById(value);
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
