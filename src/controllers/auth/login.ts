import { authRouter } from "..";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { prisma } from "../../server";
import { RefreshToken } from "../../lib/tokens/RefreshToken";
import { Password } from "../../lib/password/Password";
import {
  EmailNotConfirmedFailure,
  InvalidCredentialsFailure,
  UserHasNoPasswordFailure,
  UserNotFoundFailure,
} from "../../lib/result/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Endpoint for logging a user in by providing them with the refresh token
 * cookie on valid credentials.
 *
 * Requires the user to have email-password credentials and to have their email
 * verified.
 *
 * After logging in and receiving the refresh token cookie, the client must
 * still access the refresh_token endpoint to get their access token.
 */
authRouter.post("/login", rateLimiters.strict(), async (req, res, next) => {
  /**
   * Validate body
   */
  const body = await validateRequestBody(req, Schemas.Auth.full);
  if (body.isFailure()) return next(body);

  /**
   * Get user and ensure user exists and, has password and verified email
   */
  const user = await prisma.user.findUnique({
    where: { email: body.value.email },
  });
  if (!user) {
    const msg = `No user found with the email ${body.value.email}`;
    return next(new UserNotFoundFailure().withMessage(msg));
  }
  if (!user.emailVerified) return next(new EmailNotConfirmedFailure());
  if (!user.password) return next(new UserHasNoPasswordFailure());

  /**
   * Validate password
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
  new RefreshToken(user, prisma).sendCookie(res).end();
});
