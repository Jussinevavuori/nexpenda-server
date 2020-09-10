import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import { Errors } from "../../errors/Errors";
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
    return new Failure(
      Errors.Auth.UserNotFound(
        `No user found with the email ${body.value.email}`
      )
    );
  }

  if (!user.emailVerified) {
    return new Failure(Errors.Auth.EmailNotConfirmed());
  }

  if (!user.password) {
    return new Failure(
      Errors.Auth.InvalidCredentials("User does not have a password")
    );
  }

  /**
   * Compare passwords
   */
  const passwordValid = await Password.validate(
    body.value.password,
    user.password
  );

  if (!passwordValid) {
    return new Failure(Errors.Auth.InvalidCredentials("Wrong password"));
  }

  /**
   * Send refresh token in respone if everything succeeded
   */
  new RefreshToken(user).send(res).end();
});
