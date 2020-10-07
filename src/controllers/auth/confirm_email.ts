import { authRouter } from "..";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";
import { prisma } from "../../server";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";

authRouter.post("/confirm_email/:token", async (req, res, next) => {
  /**
   * Get and verify token from request
   */
  const jwt = req.params["token"];

  const token = new ConfirmEmailToken(jwt);

  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return next(new InvalidTokenFailure());
  }

  /**
   * Attempt to get user from token, ensure user has email. Upon failure, show
   * invalid or expired token message.
   */
  const user = await prisma.user.findOne({ where: { id: token.uid } });

  if (!user || !user.email || user.disabled) {
    return next(new UserNotFoundFailure());
  }

  /**
   * If token is verified and user exists and is valid, mark user's email
   * as confirmed
   */
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  return res.end();
});
