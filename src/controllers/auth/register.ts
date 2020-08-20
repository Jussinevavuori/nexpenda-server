import { authRouter } from "..";
import { User } from "../../entity/user.entity";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { tokenService } from "../../services/tokenService";
import { UserAlreadyExistsError } from "../../errors/UserAlreadyExistsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { schemas } from "../bodySchemas";
import { redirect } from "../../utils/redirect";

authRouter.post("/register", async (request, response, next) => {
  try {
    const form = await getValidatedRequestBody(request, schemas.authSchema);

    const existingUser = await User.findOne({ where: { email: form.email } });

    if (existingUser) {
      return next(new UserAlreadyExistsError());
    }

    const user = await User.fromEmailPassword(form).save();

    tokenService.generateAndSendRefreshTokenAsCookie(user, response);

    redirect(response).toFrontend("/app");
  } catch (error) {
    return next(new InvalidRequestDataError("Invalid register form data"));
  }
});
