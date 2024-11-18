import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function GapDayValidation(
  property: string,
  maxGapDays: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'gapDayValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, maxGapDays],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, maxGapDays] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) {
            return true;
          }

          const fromDate = new Date(relatedValue);
          const toDate = new Date(value);

          const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return diffDays <= maxGapDays;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, maxGapDays] = args.constraints;
          return `The gap between ${relatedPropertyName} and ${args.property} must not exceed ${maxGapDays} days`;
        },
      },
    });
  };
}
