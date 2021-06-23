import { authRouter } from "..";
import { ResetPasswordToken } from "../../lib/tokens/ResetPasswordToken";
import { prisma } from "../../server";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { Password } from "../../lib/password/Password";
import {
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Mailer } from "../../lib/mail/Mailer";
import { PasswordChangedTemplate } from "../../lib/mailTemplates/PasswordChangedTemplate";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Endpoint which reads a reset password token from the request parameters.
 * When a valid password token is provided and a password is sent to this
 * endpoint, invalidates all tokens for that user and resets the user's
 * password with the specified one.
 *
 * Before accessing this endpoint, the client should access the
 * `GET /api/auth/change_password/:token` to ensure their token is valid and
 * to confirm they have the correct email, however this is not strictly
 * required.
 */
authRouter.post(
  "/change_password/:token",
  rateLimiters.strict(),
  async (req, res, next) => {
    /**
     * Get and verify token from request
     */
    const jwt = req.params["token"];
    const token = new ResetPasswordToken(jwt);
    const tokenVerified = await token.verify();
    if (!tokenVerified) return next(new InvalidTokenFailure());

    /**
     * Attempt to get user from token, ensure user has email.
     */
    const user = await prisma.user.findUnique({ where: { id: token.uid } });
    if (!user || !user.email || user.disabled) {
      return next(new UserNotFoundFailure());
    }

    /**
     * Get and validate password form
     */
    const body = await validateRequestBody(req, Schemas.Auth.passwordOnly);
    if (body.isFailure()) return next(body);

    /**
     * Hash password
     */
    const password = await Password.hash(body.value.password);

    /**
     * Update user token version and password
     */
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        tokenVersion: { increment: 1 },
      },
    });

    /**
     * Send password changed mail alert
     */
    const mailer = new Mailer();
    const passwordChangedTemplate = new PasswordChangedTemplate({
      email: user.email,
    });
    await mailer.sendTemplate(user.email, passwordChangedTemplate);

    /**
     * Send 200 OK upon success
     */
    return res.end();
  }
);
