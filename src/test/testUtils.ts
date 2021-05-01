import { testApp } from "./setup";
import * as request from "supertest";
import { HttpStatus } from "@nestjs/common";

export const signUpHelper = async () => {
    const credentials = {
        email: "test@test.com",
        password: "password",
    };

    const { body } = await request(testApp.getHttpServer())
        .post("/api/auth/sign-up")
        .send(credentials)
        .expect(HttpStatus.CREATED);

    expect(body.email).toBe(credentials.email);

    return credentials;
};

export const logInHelper = async () => {
    const credentials = await signUpHelper();

    const logInResponse = await request(testApp.getHttpServer())
        .post("/api/auth/log-in")
        .send(credentials);

    expect(logInResponse.status).toBe(HttpStatus.OK);

    return { credentials, cookie: logInResponse.get("Set-Cookie") };
};
