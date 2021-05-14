import { Model } from "mongoose";
import { Body, Controller, Post } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserCredentialsDto } from "./../dto/UserCredentialsDto";
import { User, UserDocument } from "./../model/User";
import { BadRequestError, DatabaseError } from "@gticketing-common/common";
import { SecurityService } from "./../service/SecurityService";

@Controller("/api/auth/sign-up")
export class SignUpController {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private securityService: SecurityService,
    ) {}

    @Post()
    async signUp(@Body() userCredentialsDto: UserCredentialsDto) {
        const existingUser = await this.userModel.findOne({
            email: userCredentialsDto.email,
        });

        if (!!existingUser) {
            throw new BadRequestError("User already exists.");
        }

        const passwordHash = await this.securityService.encryptPassword(
            userCredentialsDto.password,
        );
        const newUser = new this.userModel({
            email: userCredentialsDto.email,
            password: passwordHash,
        });

        try {
            return await newUser.save();
        } catch (e) {
            throw new DatabaseError("Failed to save new user.");
        }
    }
}
