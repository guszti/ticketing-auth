import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { CustomError } from "./CustomError";

export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof CustomError) {
            response
                .status(exception.statusCode)
                .json(exception.formatErrors());
        }

        throw exception;
    }
}
