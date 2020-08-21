import { authRouter } from "..";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { tokenService } from "../../services/tokenService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { validatePassword } from "../../services/passwordService";

authRouter.post("/login", async (req, res, next) => {
  try {
    const form = await getValidatedRequestBody(req, authSchema);

    const user = await prisma.user.findOne({ where: { email: form.email } });

    if (!user) {
      throw new UserNotFoundError(`No user found with the email ${form.email}`);
    }

    if (!user.password) {
      throw new InvalidCredentialsError("User does not have a password");
    }

    const passwordValid = await validatePassword(form.password, user.password);

    if (!passwordValid) {
      throw new InvalidCredentialsError("Wrong password");
    }

    tokenService.generateAndSendRefreshTokenAsCookie(user, res).end();
  } catch (e) {
    return next(e);
  }
});
