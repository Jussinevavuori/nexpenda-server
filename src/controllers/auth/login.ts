import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import {
  EmailNotConfirmedFailure,
  InvalidCredentialsFailure,
  UserHasNoPasswordFailure,
  UserNotFoundFailure,
} from "../../utils/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";

authRouter.post("/login", rateLimiters.strict(), async (req, res, next) => {
  /**
   * Validate body
   */
  const body = await validateRequestBody(req, authSchema);

  if (body.isFailure()) {
    return next(body);
  }

  /**
   * Get user and ensure user exists and has password
   */
  const user = await prisma.user.findUnique({
    where: { email: body.value.email },
  });

  if (!user) {
    return next(
      new UserNotFoundFailure().withMessage(
        `No user found with the email ${body.value.email}`
      )
    );
  }

  if (!user.emailVerified) {
    return next(new EmailNotConfirmedFailure());
  }

  if (!user.password) {
    return next(new UserHasNoPasswordFailure());
  }

  /**
   * Compare passwords
   */
  const passwordValid = await Password.validate(
    body.value.password,
    user.password
  );

  if (!passwordValid) {
    return next(new InvalidCredentialsFailure().withMessage("Wrong password"));
  }

  /**
   * Send refresh token in respone if everything succeeded
   */
  new RefreshToken(user, prisma).send(res).end();
});
