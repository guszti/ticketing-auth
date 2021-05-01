import { ValidationError } from "class-validator";
import { CustomError, FormattedCustomErrors } from "./CustomError";

interface FormattedValidationError extends FormattedCustomErrors {
    fieldErrors: { [field: string]: string[] }[];
}

export class CustomValidationError extends CustomError {
    constructor(customError: string, public fieldErrors: ValidationError[]) {
        super(400, customError);
    }

    formatErrors(): FormattedValidationError {
        return {
            statusCode: this.statusCode,
            customError: this.customError,
            fieldErrors: this.fieldErrors.map(
                (errorObject: ValidationError) => ({
                    [errorObject.property]: Object.keys(
                        errorObject.constraints,
                    ).map((key) => errorObject.constraints[key]),
                }),
            ),
        };
    }
}
