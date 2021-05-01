import { testApp } from "./../../test/setup";
import * as request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { logInHelper } from "./../../test/testUtils";

it("Current user can be obtained", async () => {
    const { credentials, cookie } = await logInHelper();

    const response = await request(testApp.getHttpServer())
        .get("/api/auth/current-user")
        .set("Cookie", cookie);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.email).toBe(credentials.email);
});
