import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function FromToValidation(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'fromToValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) {
            return true;
          }

          const fromDate = new Date(relatedValue);
          const toDate = new Date(value);

          if (toDate < fromDate) {
            console.log('fromDate');
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be greater than or equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}
