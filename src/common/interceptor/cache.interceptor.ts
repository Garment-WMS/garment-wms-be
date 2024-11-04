import { CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { of, tap } from 'rxjs';

export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    readonly cacheManager: Cache,
    readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const invalidationKeywords = ['post', 'update', 'patch', 'delete'];
    const key = this.trackBy(context);
    if (key) {
      if (
        key &&
        invalidationKeywords.some((keyword) =>
          context.getHandler().name.toLowerCase().includes(keyword),
        )
      ) {

        //This method is not recommended for production use, as it will clear all cache
        //Find a way to clear cache by key
        await this.cacheManager.reset();
      }
      const cachedResponse = await this.cacheManager.get(key);
      if (cachedResponse) {
        return of(cachedResponse); // Wrap cached response in Observable
      } else {
        console.log('No cached response found for key:', key);
      }
    }
    return next.handle().pipe(
      tap(async (response) => {
        if (key) {
          console.log('Caching response for key:', key);
          await this.cacheManager.set(key, response);
        }
      }),
    );
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const key = `${request.url}`;
    return key;
  }
}
