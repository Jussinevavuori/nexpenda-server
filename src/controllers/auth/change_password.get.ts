import { authRouter } from "..";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { prisma } from "../../server";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";

authRouter.get("/change_password/:token", async (req, res, next) => {
  /**
   * Get token from request and verify it
   */
  const jwt = req.params["token"];

  const token = new ForgotPasswordToken(jwt);

  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return next(new InvalidTokenFailure());
  }

  /**
   * Attempt to get user from token, ensure user has email
   */
  const user = await prisma.user.findUnique({ where: { id: token.uid } });

  if (!user || !user.email || user.disabled) {
    return next(new UserNotFoundFailure());
  }

  /**
   * Upon success, send user's email address as a response, signaling
   * a valid token
   */
  res.send(user.email);
});
