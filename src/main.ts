import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ValidationError } from "class-validator";
import { AppModule } from "./app.module";
import { CustomExceptionFilter } from "./helper/error/CustomExceptionFilter";
import { CustomValidationError } from "./helper/error/CustomValidationError";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalFilters(new CustomExceptionFilter());

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                throw new CustomValidationError("Validation failed", errors);
            },
        }),
    );

    await app.listen(4000, () =>
        console.log("Auth service is listening on port 4000."),
    );
}
bootstrap();
