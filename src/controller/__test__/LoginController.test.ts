import { testApp } from "./../../test/setup";
import * as request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { logInHelper } from "./../../test/testUtils";

it("User can log in", async () => {
    const { credentials, cookie } = await logInHelper();

    const logInResponse = await request(testApp.getHttpServer())
        .post("/api/auth/log-in")
        .send(credentials)
        .set("Cookie", cookie);

    expect(logInResponse.status).toBe(HttpStatus.OK);
});
