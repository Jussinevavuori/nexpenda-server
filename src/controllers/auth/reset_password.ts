import { authRouter } from "../../routers";
import { prisma } from "../../server";
import { Mailer } from "../../lib/mail/Mailer";
import { ResetPasswordTemplate } from "../../lib/mailTemplates/ResetPasswordTemplate";
import { ResetPasswordToken } from "../../lib/tokens/ResetPasswordToken";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import {
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * If a user wants to change their password or they have forgotten their
 * password, they can post a request to this endpoint with their email. This
 * sends a reset password token in an email to their email address, which can
 * then be used in the change_password endpoints for resetting the password.
 */
authRouter.post(
  "/reset_password",
  rateLimiters.strict(),
  async (req, res, next) => {
    /**
     * Validate body
     */
    const body = await validateRequestBody(req, Schemas.Auth.emailOnly);
    if (body.isFailure()) return next(body);

    /**
     * Find user by email
     */
    const user = await prisma.user.findUnique({
      where: { email: body.value.email },
    });
    if (!user || !user.email) {
      return next(new UserNotFoundFailure());
    }

    /**
     * Create reset password token for user and verify it
     */
    const token = new ResetPasswordToken(user);
    const tokenVerified = await token.verify();
    if (!tokenVerified) return next(new InvalidTokenFailure());

    /**
     * Send token as mail to user
     */
    const mailer = new Mailer();
    const template = new ResetPasswordTemplate({
      email: user.email,
      url: token.generateURL(),
    });
    await mailer.sendTemplate(user.email, template);

    /**
     * End with empty response
     */
    res.end();
  }
);
