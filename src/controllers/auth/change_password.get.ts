import { authRouter } from "../../routers";
import { ResetPasswordToken } from "../../lib/tokens/ResetPasswordToken";
import { prisma } from "../../server";
import {
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";

/**
 * Endpoint for verifying a reset password token. If this endpoint responds
 * with a 200 containing the user's email, the reset password token is
 * considered valid.
 *
 * The client can then proceed to display the correct email and allow the user
 * to change their password by using the same token to post to the
 * `POST /api/auth/change_password/:token` endpoint which then handles changing
 * the password itself.
 */
authRouter.get(
  "/change_password/:token",
  rateLimiters.strict(),
  async (req, res, next) => {
    /**
     * Get token from request and verify it
     */
    const jwt = req.params["token"];
    const token = new ResetPasswordToken(jwt);
    const tokenVerified = await token.verify();
    if (!tokenVerified) return next(new InvalidTokenFailure());

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
  }
);
