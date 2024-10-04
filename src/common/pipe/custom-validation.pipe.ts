import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const formattedErrors = validationErrors.map((error) => ({
        target: error.target,
        value: error.value,
        property: error.property,
        children: error.children,
        constraints: error.constraints,
      }));

      return new BadRequestException({
        statusCode: 400,
        message: 'Invalid input data',
        error: formattedErrors,
      });
    };
  }
}
