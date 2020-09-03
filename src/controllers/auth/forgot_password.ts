import { authRouter } from "..";
import { prisma } from "../../server";
import { protectedRoute } from "../../middleware/protectedRoute";
import { v4 as uuid } from "uuid";
import { conf } from "../../conf";
import { addHours } from "date-fns";
import { Mailer } from "../../services/Mailer";
import { ForgotPasswordTemplate } from "../../mailTemplates/ForgotPasswordTemplate";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { emailOnlyAuthSchema } from "../../schemas/auth.schema";

authRouter.post("/forgot_password", async (request, response, next) => {
  try {
    const form = await getValidatedRequestBody(request, emailOnlyAuthSchema);

    const user = await prisma.user.findOne({ where: { email: form.email } });

    if (!user || !user.email) {
      throw new UserNotFoundError();
    }

    const mailer = new Mailer();

    const token = new ForgotPasswordToken(user);

    const template = new ForgotPasswordTemplate({
      email: user.email,
      url: token.generateURL(),
    });

    await mailer.sendTemplate(user.email, template);

    response.end();
  } catch (e) {
    return next(e);
  }
});
