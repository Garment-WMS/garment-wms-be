import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomValidationException } from '../filter/custom-validation.exception';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const firstError = validationErrors[0];
      const firstConstraintValue =
        firstError && firstError.constraints
          ? Object.values(firstError.constraints)[0]
          : 'Validation failed';

      return new CustomValidationException(
        400,
        firstConstraintValue,
        validationErrors,
      );
    };
  }
}
