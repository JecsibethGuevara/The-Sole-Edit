import {
    Catch,
    HttpException,
    ExceptionFilter,
    ArgumentsHost
} from '@nestjs/common'
import { error } from 'console';
import { Request, response, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()
        const errorResponse = exception.getResponse()

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toString(),
            path: request.url,
            method: request.method,
            error: typeof errorResponse === 'object' && 'message' in errorResponse ? errorResponse['message'] : errorResponse
        })

    }
}