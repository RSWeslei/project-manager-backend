import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

type ErrorResponse = {
  message: string | string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      let rawMessage: string | string[];

      if (typeof errorResponse === 'object' && errorResponse !== null) {
        rawMessage =
          (errorResponse as ErrorResponse).message || exception.message;
      } else {
        rawMessage = errorResponse;
      }

      message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = 'Erro interno do servidor';
    }

    response.status(status).json({
      type: 'error',
      data: null,
      message,
    });
  }
}
