import { HttpStatus } from "@nestjs/common";
import { CustomError, FormattedCustomErrors } from "./CustomError";

export class BadRequestError extends CustomError {
    constructor(customError: string) {
        super(HttpStatus.BAD_REQUEST, customError);
    }

    formatErrors(): FormattedCustomErrors {
        return {
            statusCode: this.statusCode,
            customError: this.customError,
        };
    }
}
