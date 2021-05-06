import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class SecurityService {
    public async encryptPassword(plainPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(plainPassword, salt);

        return passwordHash;
    }

    public async comparePasswords(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    public makeNewJWT(email: string, userId: string) {
        return jwt.sign({ email, userId }, process.env.JWT_SECRET);
    }
}
