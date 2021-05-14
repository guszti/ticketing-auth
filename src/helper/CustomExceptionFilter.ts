import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { CustomError } from "@gticketing-common/common";

export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof CustomError) {
            return response
                .status(exception.statusCode)
                .json(exception.formatErrors());
        }

        return response.status(exception.statusCode).json({
            statusCode: exception.statusCode,
            customError: exception.message,
            fieldErrors: [],
        });
    }
}
