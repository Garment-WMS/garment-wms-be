import { Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueInArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    const properties = args.constraints;
    if (!value || !Array.isArray(value) || value.length === 0) {
      return true;
    }
    for (const property of properties) {
      const uniqueValues = new Set();
      for (const item of value) {
        if (uniqueValues.has(item[property])) {
          Logger.debug(`Duplicate value found: ${item[property]}`);
          return false;
        }
        if (item[property] !== null && item[property] !== undefined) {
          uniqueValues.add(item[property]);
        }
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [property] = args.constraints;
    return `${property} must be unique within the array.`;
  }
}

export function UniqueInArray(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: properties,
      validator: UniqueInArrayConstraint,
    });
  };
}
