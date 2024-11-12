import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MinDateCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minDateCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          return value && new Date(value) >= currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `Date must be in the future`;
        },
      },
    });
  };
}