import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserCredentialsDto } from "./../dto/UserCredentialsDto";
import { User, UserDocument } from "./../model/User";
import { BadRequestError } from "./../helper/error/BadRequestError";
import { SecurityService } from "./../service/SecurityService";
import { Response } from "express";

@Controller("/api/auth/log-in")
export class LoginController {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private securityService: SecurityService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async logIn(
        @Body() userCredentials: UserCredentialsDto,
        @Res() response: Response,
    ) {
        const user = await this.userModel.findOne({
            email: userCredentials.email,
        });

        if (!user) {
            throw new BadRequestError("User not found.");
        }

        const result = await this.securityService.comparePasswords(
            userCredentials.password,
            user.password,
        );

        if (!result) {
            throw new BadRequestError("Invalid credentials.");
        }

        const token = this.securityService.makeNewJWT(user.email, user._id);

        response.cookie("jwt", token);

        response.send();
    }
}
