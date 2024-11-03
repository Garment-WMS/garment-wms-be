import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOneExists(
  property1: string,
  property2: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property1, property2], // Ensure constraints are passed here
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName1, relatedPropertyName2] = args.constraints;
          const relatedValue1 = (args.object as any)[relatedPropertyName1];
          const relatedValue2 = (args.object as any)[relatedPropertyName2];
          if (relatedValue1 !== undefined && relatedValue2 !== undefined) {
            return false; // Both values are defined, return false
          }
          return (
            (relatedValue1 !== undefined && relatedValue1 !== null) ||
            (relatedValue2 !== undefined && relatedValue2 !== null)
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName1, relatedPropertyName2] = args.constraints;
          const relatedValue1 = (args.object as any)[relatedPropertyName1];
          const relatedValue2 = (args.object as any)[relatedPropertyName2];
          if (relatedValue1 !== undefined && relatedValue2 !== undefined) {
            return `Both ${relatedPropertyName1} and ${relatedPropertyName2} cannot be provided together.`;
          }
          return `Either ${relatedPropertyName1} or ${relatedPropertyName2} must be provided.`;
        },
      },
    });
  };
}
