import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("/api/auth/current-user")
export class CurrentUserController {
    @Get()
    currentUser(@Req() req: Request) {
        return req["user"];
    }
}
