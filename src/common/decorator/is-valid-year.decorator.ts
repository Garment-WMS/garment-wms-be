import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const errorMessage = 'Year is required';
          const currentYear = new Date().getFullYear();
          if (!value) {
            this.errorMessage = 'Year is required';
            return false;
          }
          if (value.match(/^[0-9]{4}$/) === null) {
            this.errorMessage = 'Year must be a four-digit number';
            return false;
          }
          if (parseInt(value) >= currentYear) {
            this.errorMessage =
              'Year must be less than or equal to the current year';
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
