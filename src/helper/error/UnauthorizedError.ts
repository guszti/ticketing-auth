import { CustomError, FormattedCustomErrors } from "./CustomError";

export class UnauthorizedError extends CustomError {
    constructor(customError: string) {
        super(401, customError);
    }

    formatErrors(): FormattedCustomErrors {
        return {
            statusCode: this.statusCode,
            customError: this.customError,
        };
    }
}
