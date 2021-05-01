import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "./../helper/error/UnauthorizedError";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies["jwt"];

        if (!token) {
            throw new UnauthorizedError("Authentication failed.");
        }

        try {
            jwt?.verify(token, "dasecret");
        } catch (e) {
            throw new UnauthorizedError("Authentication failed.");
        }

        next();
    }
}
