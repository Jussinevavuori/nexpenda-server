import { Route } from "../../utils/Route";
import { viewsRouter } from "..";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";
import { ConfirmEmailView } from "../../views/ConfirmEmailView";
import { prisma } from "../../server";

new Route(viewsRouter, "/confirm_email/:token").get(async (req, res) => {
  /**
   * Get JWT from request parameters, construct a token using the JWT and verify
   * the token. Upon unverified token, show invalid or expired token message.
   */
  const jwt = req.params["token"];

  const token = new ConfirmEmailToken(jwt);

  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return new ConfirmEmailView({ valid: false }).render(res);
  }

  /**
   * Attempt to get user from token, ensure user has email. Upon failure, show
   * invalid or expired token message.
   */
  const user = await prisma.user.findOne({ where: { id: token.uid } });

  if (!user || !user.email || user.disabled) {
    return new ConfirmEmailView({ valid: false }).render(res);
  }

  /**
   * If token is verified and user exists and is valid, mark user's email
   * as confirmed
   */
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  return new ConfirmEmailView({ valid: true }).render(res);
});
