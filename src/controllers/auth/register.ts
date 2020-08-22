import { authRouter } from "..";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { tokenService } from "../../services/tokenService";
import { UserAlreadyExistsError } from "../../errors/UserAlreadyExistsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { redirect } from "../../utils/redirect";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { hashPassword } from "../../services/passwordService";

authRouter.post("/register", async (request, response, next) => {
  try {
    const form = await getValidatedRequestBody(request, authSchema);

    const existingUser = await prisma.user.findOne({
      where: { email: form.email },
    });

    if (existingUser) {
      return next(new UserAlreadyExistsError());
    }

    const hashedPassword = await hashPassword(form.password);

    const user = await prisma.user.create({
      data: {
        displayName: form.email,
        email: form.email,
        password: hashedPassword,
      },
    });

    tokenService.generateAndSendRefreshTokenAsCookie(user, response);

    redirect(response).toFrontend("/app");
  } catch (error) {
    return next(new InvalidRequestDataError("Invalid register form data"));
  }
});
