import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest<Request>();

    try {
      const body = JSON.parse(request.body.createMaterialDto);
      console.log('body', body);
      request.body.createMaterialDto = body;
    } catch (err) {
      throw new BadRequestException(err);
    }

    return next.handle();
  }
}
