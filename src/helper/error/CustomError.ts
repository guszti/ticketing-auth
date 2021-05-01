export interface FormattedCustomErrors {
    statusCode: number;
    customError: string;
}

export abstract class CustomError extends Error {
    constructor(public statusCode: number, protected customError: string) {
        super("A custom error was thrown.");
    }

    abstract formatErrors(): FormattedCustomErrors;
}
