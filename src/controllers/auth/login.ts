import { authRouter } from "..";
import { User } from "../../entity/user.entity";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { tokenService } from "../../services/tokenService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { schemas } from "../bodySchemas";

authRouter.post("/login", async (req, res, next) => {
  try {
    const form = await getValidatedRequestBody(req, schemas.authSchema);

    const user = await User.findOne({ where: { email: form.email } });

    if (!user) {
      throw new UserNotFoundError(`No user found with the email ${form.email}`);
    }

    const passwordValid = await user.validatePassword(form.password);

    if (!passwordValid) {
      throw new InvalidCredentialsError("Wrong password");
    }

    tokenService.generateAndSendRefreshTokenAsCookie(user, res).end();
  } catch (e) {
    return next(e);
  }
});
