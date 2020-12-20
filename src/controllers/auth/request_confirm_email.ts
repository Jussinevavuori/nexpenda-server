import { authRouter } from "..";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";
import { prisma } from "../../server";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { emailOnlyAuthSchema } from "../../schemas/auth.schema";
import { Mailer } from "../../services/Mailer";
import { ConfirmEmailTemplate } from "../../mailTemplates/ConfirmEmailTemplate";
import {
  EmailAlreadyConfirmedFailure,
  InvalidTokenFailure,
  UserNotFoundFailure,
} from "../../utils/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";

authRouter.post(
  "/request_confirm_email",
  rateLimiters.strict(),
  async (req, res, next) => {
    const body = await validateRequestBody(req, emailOnlyAuthSchema);

    if (body.isFailure()) {
      return next(body);
    }

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

    return res.end();
  }
);
