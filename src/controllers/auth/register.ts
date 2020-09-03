import { authRouter } from "..";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { UserAlreadyExistsError } from "../../errors/UserAlreadyExistsError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";
import { Password } from "../../services/Password";
import { GenericApplicationError } from "../../errors/GenericApplicationError";

authRouter.post("/register", async (request, response, next) => {
  try {
    const form = await getValidatedRequestBody(request, authSchema);

    const existingUser = await prisma.user.findOne({
      where: { email: form.email },
    });

    if (existingUser) {
      return next(new UserAlreadyExistsError());
    }

    const hashedPassword = await Password.hash(form.password);

    const user = await prisma.user.create({
      data: {
        displayName: form.email,
        email: form.email,
        password: hashedPassword,
      },
    });

    new RefreshToken(user).send(response).end();
  } catch (error) {
    if (error instanceof GenericApplicationError) {
      return next(error);
    }
    return next(new InvalidRequestDataError("Invalid register form data"));
  }
});
