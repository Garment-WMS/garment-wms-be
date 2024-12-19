import { HttpException } from '@nestjs/common';
import { ApiResponse } from '../dto/response.dto';

export class CustomHttpException extends HttpException {
  constructor(status: number, response: ApiResponse) {
    super(response, status);
  }
}
