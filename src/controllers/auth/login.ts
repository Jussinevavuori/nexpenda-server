import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";

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
    return Failure.UserNotFound().withMessage(
      `No user found with the email ${body.value.email}`
    );
  }

  if (!user.emailVerified) {
    return Failure.EmailNotConfirmed();
  }

  if (!user.password) {
    return Failure.UserHasNoPassword();
  }

  /**
   * Compare passwords
   */
  const passwordValid = await Password.validate(
    body.value.password,
    user.password
  );

  if (!passwordValid) {
    return Failure.InvalidCredentials().withMessage("Wrong password");
  }

  /**
   * Send refresh token in respone if everything succeeded
   */
  new RefreshToken(user).send(res).end();
});
