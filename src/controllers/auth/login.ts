import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import { Route } from "../../utils/Route";
import {
  EmailNotConfirmedFailure,
  InvalidCredentialsFailure,
  UserHasNoPasswordFailure,
  UserNotFoundFailure,
} from "../../utils/Failures";

new Route(authRouter, "/login").post(async (req, res) => {
  /**
   * Validate body
   */
  const body = await validateRequestBody(req, authSchema);

  if (body.isFailure()) {
    return body;
  }

  /**
   * Get user and ensure user exists and has password
   */
  const user = await prisma.user.findOne({
    where: { email: body.value.email },
  });

  if (!user) {
    return new UserNotFoundFailure().withMessage(
      `No user found with the email ${body.value.email}`
    );
  }

  if (!user.emailVerified) {
    return new EmailNotConfirmedFailure();
  }

  if (!user.password) {
    return new UserHasNoPasswordFailure();
  }

  /**
   * Compare passwords
   */
  const passwordValid = await Password.validate(
    body.value.password,
    user.password
  );

  if (!passwordValid) {
    return new InvalidCredentialsFailure().withMessage("Wrong password");
  }

  /**
   * Send refresh token in respone if everything succeeded
   */
  new RefreshToken(user).send(res).end();
});
