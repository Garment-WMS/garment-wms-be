import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOneExists(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyNames] = args.constraints;
          const object = args.object as any;
          return relatedPropertyNames.some((propertyName) => {
            return (
              object[propertyName] !== undefined &&
              object[propertyName] !== null
            );
          });
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyNames] = args.constraints;
          return `At least one of ${relatedPropertyNames.join(', ')} must exist`;
        },
      },
    });
  };
}
