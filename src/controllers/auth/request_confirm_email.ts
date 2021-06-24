import { authRouter } from "../../routers";
import { ConfirmEmailToken } from "../../lib/tokens/ConfirmEmailToken";
import { prisma } from "../../server";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { Mailer } from "../../lib/mail/Mailer";
import { ConfirmEmailTemplate } from "../../lib/mailTemplates/ConfirmEmailTemplate";
import {
  EmailAlreadyConfirmedFailure,
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * If a user has not confirmed their email address and has lost the
 * confirmation email, they can request a new one by posting their email
 * address to this endpoint.
 */
authRouter.post(
  "/request_confirm_email",
  rateLimiters.strict(),
  async (req, res, next) => {
    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Auth.emailOnly);
    if (body.isFailure()) return next(body);

    /**
     * Get user and ensure they have a valid, verified email
     */
    const user = await prisma.user.findUnique({
      where: { email: body.value.email },
    });
    if (!user || !user.email || user.disabled) {
      return next(new UserNotFoundFailure());
    }
    if (user.emailVerified) {
      return next(new EmailAlreadyConfirmedFailure());
    }

    /**
     * Create and verify token
     */
    const token = new ConfirmEmailToken(user);
    const tokenVerified = await token.verify();
    if (!tokenVerified) {
      return next(new InvalidTokenFailure());
    }

    /**
     * Send confirm email to user
     */
    const mailer = new Mailer();
    const template = new ConfirmEmailTemplate({
      email: user.email,
      url: token.generateURL(),
    });
    await mailer.sendTemplate(user.email, template);

    /**
     * End with empty response
     */
    return res.end();
  }
);
