import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { In, TreeLevelColumn } from 'typeorm';

export interface Response<T> {
    success: boolean;
    message: string;
    timestamp: Date;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                success: true,
                ...data,
                message: 'Request successful',
                timestamp: new Date(),
            }))
        )
    }

}