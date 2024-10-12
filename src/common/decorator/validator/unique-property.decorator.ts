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
    properties.forEach((property) => {
      // const nonNullArray = value.filter((item) => {
      //   if (item[property] !== null && item[property] !== undefined) {
      //     Logger.debug(`item[property]: ${item[property]}`);
      //     return false;
      //   }
      // });

      const uniqueValues = new Set(value.map((item) => item[property]));
      if (uniqueValues.size !== value.length) {
        return false;
      }
    });
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
