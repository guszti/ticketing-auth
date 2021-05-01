import { testApp } from "./../../test/setup";
import * as request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { logInHelper } from "./../../test/testUtils";

it("User can log out", async () => {
    const { cookie } = await logInHelper();

    const logOutResponse = await request(testApp.getHttpServer())
        .post("/api/auth/log-out")
        .set("Cookie", cookie);

    expect(logOutResponse.status).toBe(HttpStatus.OK);
    expect(logOutResponse.get("Set-Cookie")[0].split("jwt=")[1][0]).toBe(";");
});
