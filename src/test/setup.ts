import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User, UserSchema } from "./../model/User";
import { CurrentUserController } from "./../controller/CurrentUserController";
import { LoginController } from "./../controller/LoginController";
import { LogOutController } from "./../controller/LogOutController";
import { SignUpController } from "./../controller/SignUpController";
import { SecurityService } from "./../service/SecurityService";
import * as cookieParser from "cookie-parser";
import { CustomExceptionFilter } from "../helper/CustomExceptionFilter";
import { ValidationError } from "class-validator";
import {
    CustomValidationError,
    CurrentUserMiddleware,
    AuthMiddleware,
} from "@gticketing-common/common";
import { NextFunction, Request } from "express";

let mongoInstance = new MongoMemoryServer();
export let testApp: INestApplication;

beforeAll(async () => {
    const uri = await mongoInstance.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            MongooseModule.forRoot(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            MongooseModule.forFeature([
                { name: User.name, schema: UserSchema },
            ]),
        ],
        controllers: [
            CurrentUserController,
            LoginController,
            LogOutController,
            SignUpController,
        ],
        providers: [SecurityService],
    }).compile();

    testApp = moduleFixture.createNestApplication();

    testApp.use(cookieParser());
    testApp.useGlobalFilters(new CustomExceptionFilter());
    testApp.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                throw new CustomValidationError("Validation failed", errors);
            },
        }),
    );

    testApp.use(
        (req: Request, res: globalThis.Response, next: NextFunction) => {
            if (["/api/auth/sign-up", "/api/auth/log-in"].includes(req.url)) {
                next();
            } else {
                new AuthMiddleware().use(req, res, next);
            }
        },
    );

    testApp.use(
        (req: Request, res: globalThis.Response, next: NextFunction) => {
            if (req.url === "/api/auth/current-user") {
                new CurrentUserMiddleware().use(req, res, next);
            } else {
                next();
            }
        },
    );

    await testApp.init();
});

afterEach(async () => {
    const db = mongoose.connection.db;

    if (!db) {
        return;
    }

    const collections = await db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await testApp.close();
    await mongoInstance.stop();
    await mongoose.connection.close();
});
