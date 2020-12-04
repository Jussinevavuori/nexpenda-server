import { authRouter } from "..";
import { prisma } from "../../server";
import { Mailer } from "../../services/Mailer";
import { ForgotPasswordTemplate } from "../../mailTemplates/ForgotPasswordTemplate";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { emailOnlyAuthSchema } from "../../schemas/auth.schema";
import { InvalidTokenFailure, UserNotFoundFailure } from "../../utils/Failures";

authRouter.post("/forgot_password", async (req, res, next) => {
  /**
   * Validate body
   */
  const body = await validateRequestBody(req, emailOnlyAuthSchema);

  if (body.isFailure()) {
    return next(body);
  }

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
   * Create forgot password token for user
   */
  const token = new ForgotPasswordToken(user);

  /**
   * Verify token
   */
  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return next(new InvalidTokenFailure());
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

  res.end();
});
