import { authRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { Route } from "../../utils/Route";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";
import { Success } from "../../utils/Result";

new Route(authRouter, "/change_password/:token").get(
  async (request, response) => {
    /**
     * Get token from request and verify it
     */
    const jwt = request.params["token"];

    const token = new ForgotPasswordToken(jwt);

    const tokenVerified = await token.verify();

    if (!tokenVerified) {
      return new InvalidTokenFailure<string>();
    }

    /**
     * Attempt to get user from token, ensure user has email
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });

    if (!user || !user.email || user.disabled) {
      return new UserNotFoundFailure<string>();
    }

    /**
     * Upon success, send user's email address as a response, signaling
     * a valid token
     */
    return new Success(user.email);
  }
);
