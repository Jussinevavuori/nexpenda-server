import { viewsRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { Response } from "express";
import { prisma } from "../../server";
import { Password } from "../../services/Password";
import { conf } from "../../conf";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { passwordOnlyAuthSchema } from "../../schemas/auth.schema";
import { UnimplementedError } from "../../errors/UnimplementedError";

function fail(response: Response, message: string) {
  response.send(`<p>${message}</p>`);
}

viewsRouter.get("/forgot_password/:token", async (request, response, next) => {
  /**
   * Show done message
   */
  if (request.params["token"] === "done") {
    return response.render("forgot_password_done", {
      hosts: {
        client: conf.hosts.client,
      },
    });
  }

  try {
    /**
     * Get token from request parameters
     */
    const rawToken = request.params["token"];

    const token = new ForgotPasswordToken(rawToken);

    // VERIFY TOKEN

    const user = await prisma.user.findOne({ where: { id: "1" } });

    // VERIFY USER

    return response.render("forgot_password", {
      user,
      hosts: {
        client: conf.hosts.client,
      },
    });

    // response.send({ message: "Your password has been reset to " + unhashed });
  } catch (e) {
    console.log(e);

    return fail(response, "Error occured during password reset");
  }
});

viewsRouter.post("/forgot_password/:token", async (request, response, next) => {
  try {
    const rawToken = request.params["token"];

    const token = new ForgotPasswordToken(rawToken);

    const body = await getValidatedRequestBody(request, passwordOnlyAuthSchema);

    // /**
    //  * Verify token and token version
    //  */
    // const verified = await token.verify();
    // if (!verified) {
    //   return fail(response, "Invalid or already used reset link.");
    // }

    /**
     * Todo: error handling, read and validate token,
     * get user, update user token version + password,
     * hash password, send 200 OK
     */

    /**
     * Fetch user to update
     */
    // const user = await prisma.user.findOne({ where: { id: token.uid } });
    // if (!user) {
    //   return response.send("Failed");
    // }

    /**
     * Hash new password
     */
    const password = await Password.hash(body.password);

    /**
     * Update password, increment token version
     */
    // const result = await prisma.user.update({
    //   where: { id: user.id },
    //   data: { password, tokenVersion: user.tokenVersion + 1 },
    // });

    throw new UnimplementedError();
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Password changing not yet implemented" });
  }
});
