import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { authSchema } from "../../schemas/auth.schema";
import { prisma } from "../../server";
import { Password } from "../../services/Password";
import { Mailer } from "../../services/Mailer";
import { ConfirmEmailTemplate } from "../../mailTemplates/ConfirmEmailTemplate";
import { ConfirmEmailToken } from "../../services/ConfirmEmailToken";
import {
  DatabaseAccessFailure,
  UserAlreadyExistsFailure,
} from "../../utils/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";

authRouter.post("/register", rateLimiters.strict(), async (req, res, next) => {
  try {
    // Validate request body
    const body = await validateRequestBody(req, authSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Check for existing users with given email
    const existingUser = await prisma.user.findUnique({
      where: { email: body.value.email },
    });
    if (existingUser) {
      return next(new UserAlreadyExistsFailure());
    }

    // Hash password
    const hashedPassword = await Password.hash(body.value.password);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: body.value.email,
        password: hashedPassword,
        tokenVersion: 1,
        emailVerified: false,
        Profile: {
          create: {
            displayName: body.value.email,
          },
        },
      },
      include: { Profile: true },
    });

    // Generate confirm email token for user
    const token = new ConfirmEmailToken(user);

    // Send confirmation email if email given
    if (user.email) {
      const mailer = new Mailer();
      const template = new ConfirmEmailTemplate({
        email: user.email,
        url: token.generateURL(),
      });
      await mailer.sendTemplate(user.email, template);
    }

    return res.end();
  } catch (e) {
    return next(new DatabaseAccessFailure());
  }
});
