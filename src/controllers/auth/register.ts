import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import { Route } from "../../utils/Route";
import { Errors } from "../../errors/Errors";
import { Failure } from "../../utils/Result";

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
    return new Failure(Errors.Auth.UserAlreadyExists());
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
   * Create refresh token for user and send in response
   */
  new RefreshToken(user).send(response).end();
});
