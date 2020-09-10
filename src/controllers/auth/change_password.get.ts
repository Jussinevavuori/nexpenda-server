import { authRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";
import { Errors } from "../../errors/Errors";

new Route(authRouter, "/change_password/:token").get(
  async (request, response) => {
    /**
     * Get token from request and verify it
     */
    const jwt = request.params["token"];

    const token = new ForgotPasswordToken(jwt);

    const tokenVerified = await token.verify();

    if (!tokenVerified) {
      return Failure.error(() => Errors.Token.Invalid());
    }

    /**
     * Attempt to get user from token, ensure user has email
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });

    if (!user || !user.email || user.disabled) {
      return Failure.error(() => Errors.Auth.UserNotFound());
    }

    /**
     * Upon success, send user's email address as a response, signaling
     * a valid token
     */
    response.send(user.email);
  }
);
