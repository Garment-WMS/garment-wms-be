import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsYearFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isYearFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log('value', value);
          const errorMessage = 'Year is required';
          if (!value) {
            this.errorMessage = 'Year is required';
            return false;
          }
          if (value.toString().match(/^[0-9]{4}$/) === null) {
            this.errorMessage = 'Year must be a four-digit number';
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return this.errorMessage;
        },
      },
    });
  };
}
