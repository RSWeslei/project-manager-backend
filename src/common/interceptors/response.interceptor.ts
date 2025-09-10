import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  type: 'success';
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        type: 'success',
        message: 'Operação realizada com sucesso',
        data: data || null,
      })),
    );
  }
}
