import { viewsRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { ForgotPasswordView } from "../../views/ForgotPasswordView";
import { Route } from "../../utils/Route";

new Route(viewsRouter, "/forgot_password/:token").get(
  async (request, response) => {
    /**
     * Show done message if token is "done"
     */
    if (request.params["token"] === "done") {
      return new ForgotPasswordView({ done: true }).render(response);
    }

    /**
     * Get JWT from request parameters, construct a token using the JWT and verify
     * the token. Upon unverified token, show invalid or expired token message.
     */
    const jwt = request.params["token"];

    const token = new ForgotPasswordToken(jwt);

    const tokenVerified = await token.verify();

    if (!tokenVerified) {
      return new ForgotPasswordView({}).render(response);
    }

    /**
     * Attempt to get user from token, ensure user has email. Upon failure, show
     * invalid or expired token message.
     */
    const user = await prisma.user.findOne({ where: { id: token.uid } });

    if (!user || !user.email || user.disabled) {
      return new ForgotPasswordView({}).render(response);
    }

    /**
     * Upon success, render forgot password view properly
     */
    return new ForgotPasswordView({ user }).render(response);
  }
);
