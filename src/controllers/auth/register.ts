import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { Password } from "../../services/Password";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";
import { Mailer } from "../../services/Mailer";
import { ConfirmEmailTemplate } from "../../mailTemplates/ConfirmEmailTemplate";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";

new Route(authRouter, "/register").post(async (request, response) => {
  /**
   * Validate request body
   */
  const body = await validateRequestBody(request, authSchema);

  if (body.isFailure()) {
    return body;
  }

  /**
   * Check for existing users with given email
   */
  const existingUser = await prisma.user.findOne({
    where: { email: body.value.email },
  });

  if (existingUser) {
    return Failure.UserAlreadyExists();
  }

  /**
   * Hash given password
   */
  const hashedPassword = await Password.hash(body.value.password);

  /**
   * Create user
   */
  const user = await prisma.user.create({
    data: {
      displayName: body.value.email,
      email: body.value.email,
      password: hashedPassword,
    },
  });

  /**
   * Generate confirm email token for user
   */
  const token = new ConfirmEmailToken(user);

  if (user.email) {
    /**
     * Send confirm email to user
     */
    const mailer = new Mailer();

    const template = new ConfirmEmailTemplate({
      email: user.email,
      url: token.generateURL(),
    });

    await mailer.sendTemplate(user.email, template);
  }

  response.end();
});
