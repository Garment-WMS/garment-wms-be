import { UnauthorizedException } from '@nestjs/common';

export class CustomAuthException extends UnauthorizedException {
  constructor(statusCode: number, message: string, code: any) {
    super({ statusCode, message, code });
  }

  getCode(): string {
    return (this.getResponse() as any).code;
  }
  getStatusCode(): number {
    return (this.getResponse() as any).statusCode;
  }
}
