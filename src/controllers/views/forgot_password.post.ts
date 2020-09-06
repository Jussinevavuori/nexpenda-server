import { Route } from "../../utils/Route";
import { viewsRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { passwordOnlyAuthSchema } from "../../schemas/auth.schema";
import { DataError } from "../../errors/DataError";
import { Password } from "../../services/Password";

new Route(viewsRouter, "/forgot_password/:token").post(
  async (request, response) => {
    /**
     * Get JWT from request parameters, construct a token using the JWT and verify
     * the token. Upon unverified token, show invalid or expired token message.
     */
    const jwt = request.params["token"];

    const token = new ForgotPasswordToken(jwt);

    const tokenVerified = await token.verify();

    if (!tokenVerified) {
      response
        .status(400)
        .json({ message: "Invalid, expired or already used link" });
      return;
    }

    /**
     * Attempt to get user from token, ensure user has email.
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });

    if (!user || !user.email || user.disabled) {
      response.status(400).json({ message: "User no longer exists" });
      return;
    }
    /**
     * Get and validate password form
     */
    const body = await validateRequestBody(request, passwordOnlyAuthSchema);

    if (body.isFailure()) {
      response
        .status(400)
        .json({ message: "Invalid password. Try another password." });
      return;
    }

    /**
     * Hash password
     */
    const password = await Password.hash(body.value.password);

    /**
     * Update user token version and password
     */
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: user.tokenVersion + 1, password },
    });

    /**
     * Send 200 OK upon success
     */
    response.status(200).end();
    return;
  }
);
