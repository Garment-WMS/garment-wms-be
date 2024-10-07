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
    const [property] = args.constraints;
    const propertyValues = value.map((item) => item[property]);
    const uniquePropertyValues = new Set(propertyValues);
    return propertyValues.length === uniquePropertyValues.size;
  }

  defaultMessage(args: ValidationArguments) {
    const [property] = args.constraints;
    return `${property} must be unique within the array.`;
  }
}

export function UniqueInArray(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: UniqueInArrayConstraint,
    });
  };
}
