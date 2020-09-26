import { Route } from "../../utils/Route";
import { authRouter } from "..";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";
import { prisma } from "../../server";
import { Failure } from "../../utils/Result";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { emailOnlyAuthSchema } from "../../schemas/auth.schema";
import { Mailer } from "../../services/Mailer";
import { ConfirmEmailTemplate } from "../../mailTemplates/ConfirmEmailTemplate";

new Route(authRouter, "/request_confirm_email").post(async (req, res) => {
  const body = await validateRequestBody(req, emailOnlyAuthSchema);

  if (body.isFailure()) {
    return body;
  }

  const user = await prisma.user.findOne({
    where: { email: body.value.email },
  });

  if (!user || !user.email || user.disabled) {
    return Failure.UserNotFound();
  }

  if (user.emailVerified) {
    return Failure.EmailAlreadyConfirmed();
  }

  /**
   * Create and verify token
   */
  const token = new ConfirmEmailToken(user);

  const tokenVerified = await token.verify();

  if (!tokenVerified) {
    return Failure.InvalidToken();
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

  res.end();
});
