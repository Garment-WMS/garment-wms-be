import { HttpStatus } from '@nestjs/common';
import { I18nValidationError, I18nValidationException } from 'nestjs-i18n';

export class CustomI18nException extends I18nValidationException {
  constructor(
    errors: I18nValidationError[],
    code: HttpStatus,
    message: string,
  ) {
    super(errors, code);
    this.message = message;
  }
  getCode(): string {
    return (this.getResponse() as any).code;
  }
}
