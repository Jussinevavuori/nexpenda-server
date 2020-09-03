import { authRouter } from "..";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";

authRouter.post("/login", async (request, response, next) => {
  try {
    const form = await getValidatedRequestBody(request, authSchema);

    const user = await prisma.user.findOne({ where: { email: form.email } });

    if (!user) {
      throw new UserNotFoundError(`No user found with the email ${form.email}`);
    }

    if (!user.password) {
      throw new InvalidCredentialsError("User does not have a password");
    }

    const passwordValid = await Password.validate(form.password, user.password);

    if (!passwordValid) {
      throw new InvalidCredentialsError("Wrong password");
    }

    new RefreshToken(user).send(response).end();
  } catch (e) {
    return next(e);
  }
});
