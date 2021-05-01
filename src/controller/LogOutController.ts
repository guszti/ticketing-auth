import { Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";

@Controller("/api/auth/log-out")
export class LogOutController {
    @Post()
    @HttpCode(HttpStatus.OK)
    logOut(@Res() res: Response) {
        res.clearCookie("jwt").send();
    }
}
