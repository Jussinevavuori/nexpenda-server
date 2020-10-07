import { Route } from "../../utils/Route";
import { authRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { passwordOnlyAuthSchema } from "../../schemas/auth.schema";
import { Password } from "../../services/Password";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";
import { Success } from "../../utils/Result";

new Route(authRouter, "/change_password/:token").post(
  async (request, response) => {
    /**
     * Get and verify token from request
     */
    const jwt = request.params["token"];

    const token = new ForgotPasswordToken(jwt);

    const tokenVerified = await token.verify();

    if (!tokenVerified) {
      return new InvalidTokenFailure<string>();
    }

    /**
     * Attempt to get user from token, ensure user has email.
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });

    if (!user || !user.email || user.disabled) {
      return new UserNotFoundFailure<string>();
    }

    /**
     * Get and validate password form
     */
    const body = await validateRequestBody(request, passwordOnlyAuthSchema);

    if (body.isFailure()) {
      return body;
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
    return Success.Empty();
  }
);
