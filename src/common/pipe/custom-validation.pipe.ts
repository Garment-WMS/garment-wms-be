import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomValidationException } from '../filter/custom-validation.exception';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      console.log('validationErrors', validationErrors);
      return new CustomValidationException(
        400,
        'Validation failed',
        validationErrors,
      );
    };
  }
}
