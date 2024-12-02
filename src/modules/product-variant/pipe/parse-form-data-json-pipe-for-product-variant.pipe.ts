import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ProductVariantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest<Request>();

    try {
      const body = JSON.parse(request.body.createProductDto);
      request.body.createProductDto = body;
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return next.handle();
  }
}
