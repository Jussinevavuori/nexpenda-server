import { authRouter } from "../../routers";
import { ConfirmEmailToken } from "../../lib/tokens/ConfirmEmailToken";
import { prisma } from "../../server";
import {
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";

/**
 * Endpoint for a user's email. When the correct confirm email token is posted
 * here (the confirm email token can be found in the confirmation email), the
 * user's email is confirmed.
 */
authRouter.post(
  "/confirm_email/:token",
  rateLimiters.strict(),
  async (req, res, next) => {
    /**
     * Get and verify token from request
     */
    const jwt = req.params["token"];
    const token = new ConfirmEmailToken(jwt);
    const tokenVerified = await token.verify();
    if (!tokenVerified) return next(new InvalidTokenFailure());

    /**
     * Attempt to get user from token, ensure user has email. Upon failure, show
     * invalid or expired token message.
     */
    const user = await prisma.user.findUnique({ where: { id: token.uid } });
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

    /**
     * End with empty response
     */
    return res.end();
  }
);
