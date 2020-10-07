import { authRouter } from "..";
import { prisma } from "../../server";
import { Mailer } from "../../services/Mailer";
import { ForgotPasswordTemplate } from "../../mailTemplates/ForgotPasswordTemplate";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { emailOnlyAuthSchema } from "../../schemas/auth.schema";
import { Route } from "../../utils/Route";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";
import { Success } from "../../utils/Result";

new Route(authRouter, "/forgot_password").post(async (req, res) => {
  /**
   * Validate body
   */
  const body = await validateRequestBody(req, emailOnlyAuthSchema);

  if (body.isFailure()) {
    return body;
  }

  /**
   * Find user by email
   */
  const user = await prisma.user.findOne({
    where: { email: body.value.email },
  });

  if (!user || !user.email) {
    return new UserNotFoundFailure<void>();
  }

  /**
   * Create forgot password token for user
   */
  const token = new ForgotPasswordToken(user);

  /**
   * Verify token
   */
  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return new InvalidTokenFailure<void>();
  }

  /**
   * Send token as mail to user
   */
  const mailer = new Mailer();

  const template = new ForgotPasswordTemplate({
    email: user.email,
    url: token.generateURL(),
  });

  await mailer.sendTemplate(user.email, template);

  Success.Empty();
});
