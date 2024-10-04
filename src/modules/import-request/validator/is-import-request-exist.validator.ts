import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

export class IsImportRequestExistValidator
  implements ValidatorConstraintInterface
{
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    throw new Error('Method not implemented.');
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new Error('Method not implemented.');
  }
}
