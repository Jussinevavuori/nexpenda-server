import { TestClient } from "../../tests/TestClient";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { User } from "@prisma/client";

describe("/forgot_password > GET", () => {
  it("shows invalid token screen on invalid token", async (done) => {
    const client = new TestClient();
    const response = await client.get("/forgot_password/invalid", {
      omitApiInEndpoint: true,
    });
    const html = await response.text();
    expect(html).toContain("Invalid, used or expired reset password link");
    expect(html).not.toContain("Password succesfully reset");
    expect(html).not.toContain("Enter new password");
    expect(html).not.toContain("input");
    done();
  });
  it("shows done screen on done token", async (done) => {
    const client = new TestClient();
    const response = await client.get("/forgot_password/done", {
      omitApiInEndpoint: true,
    });
    const html = await response.text();
    expect(html).not.toContain("Invalid, used or expired reset password link");
    expect(html).toContain("Password succesfully reset");
    expect(html).not.toContain("Enter new password");
    expect(html).not.toContain("input");
    done();
  });
  it("shows form on valid token", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    expect(client.authenticatedUid).toBeDefined();
    const token = new ForgotPasswordToken({
      id: client.authenticatedUid!,
      tokenVersion: 1,
    } as User);
    const response = await client.get("/forgot_password/" + token.jwt, {
      omitApiInEndpoint: true,
    });
    const html = await response.text();
    expect(html).not.toContain("Invalid, used or expired reset password link");
    expect(html).not.toContain("Password succesfully reset");
    expect(html).toContain("Enter new password");
    expect(html).toContain("input");
    done();
  });
});
