import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CurrentUserController } from "./controller/CurrentUserController";
import { LoginController } from "./controller/LoginController";
import { LogOutController } from "./controller/LogOutController";
import { SignUpController } from "./controller/SignUpController";
import {
    AuthMiddleware,
    CurrentUserMiddleware,
} from "@gticketing-common/common";
import { User, UserSchema } from "./model/User";
import { SecurityService } from "./service/SecurityService";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://auth-mongo-clusterip-srv:27017/auth"),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [
        CurrentUserController,
        LoginController,
        LogOutController,
        SignUpController,
    ],
    providers: [SecurityService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {
                    path: "api/auth/sign-up",
                    method: RequestMethod.POST,
                },
                { path: "api/auth/log-in", method: RequestMethod.POST },
            )
            .forRoutes({ path: "/*", method: RequestMethod.ALL });

        consumer
            .apply(CurrentUserMiddleware)
            .forRoutes({
                path: "api/auth/current-user",
                method: RequestMethod.ALL,
            });
    }
}
