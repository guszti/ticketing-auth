import { CustomError, FormattedCustomErrors } from "./CustomError";

export class DatabaseError extends CustomError {
    constructor(customError: string) {
        super(500, customError);
    }

    formatErrors(): FormattedCustomErrors {
        return {
            statusCode: this.statusCode,
            customError: this.customError,
        };
    }
}
