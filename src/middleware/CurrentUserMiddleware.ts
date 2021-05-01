import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const jwtPayload = jwt.verify(req.cookies["jwt"], "dasecret");

        req["user"] = {
            id: jwtPayload["userId"],
            email: jwtPayload["email"],
        };

        next();
    }
}
