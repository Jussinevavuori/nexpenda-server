import { pagesRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { Response } from "express";
import { prisma } from "../../server";
import { Password } from "../../services/Password";

function fail(response: Response, message: string) {
  response.send(`<p>Invalid forgot password link</p>`);
}

pagesRouter.get("/forgot_password/:token", async (request, response, next) => {
  try {
    /**
     * Get token from request parameters
     */
    const rawToken = request.params["token"];

    /**
     * Get token
     */
    const token = new ForgotPasswordToken(rawToken);

    /**
     * Verify token and token version
     */
    const verified = await token.verify();
    if (!verified) {
      return fail(response, "Invalid or already used reset link.");
    }

    /**
     * Fetch user to update
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });
    if (!user) {
      return fail(
        response,
        "User whose password reset was requested no longer exists."
      );
    }

    /**
     * Hash new password
     */
    const unhashed = randomPassword();
    const password = await Password.hash(unhashed);

    /**
     * Update password, increment token version
     */
    const result = await prisma.user.update({
      where: { id: user.id },
      data: { password, tokenVersion: user.tokenVersion + 1 },
    });

    response.send({ message: "Your password has been reset to " + unhashed });
  } catch (e) {
    return fail(response, "Error occured during password reset");
  }
});

function randomPassword() {
  let s = "";
  let alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 8; i++) {
    s += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return s;
}
