import { ValidationError } from 'class-validator';

export class CustomValidationException {
  constructor(statusCode: number, message: string, error: ValidationError[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
  statusCode: number = 400;
  message: string;
  error: ValidationError[];
}
