import { authRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import { Password } from "../../services/Password";
import { Mailer } from "../../services/Mailer";
import { ConfirmEmailTemplate } from "../../mailTemplates/ConfirmEmailTemplate";
import { ConfirmEmailToken } from "../../tokens/ConfirmEmailToken";
import {
  DatabaseAccessFailure,
  UserAlreadyExistsFailure,
} from "../../utils/Failures";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Schemas } from "../../schemas/Schemas";

/**
 * Registers a user. Validates that no users already exist with the same email.
 * Automatically sends a confirmation email. After confirming their email, the
 * user can then log in with their new credentials.
 */
authRouter.post("/register", rateLimiters.strict(), async (req, res, next) => {
  try {
    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Auth.full);
    if (body.isFailure()) {
      return next(body);
    }

    /**
     * Check for existing users with same email
     */
    const existingUser = await prisma.user.findUnique({
      where: { email: body.value.email },
    });
    if (existingUser) {
      return next(new UserAlreadyExistsFailure());
    }

    /**
     * Hash password
     */
    const hashedPassword = await Password.hash(body.value.password);

    /**
     * Create user and empty profile
     */
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

    /**
     * Generate confirm email token
     */
    const token = new ConfirmEmailToken(user);

    /**
     * Send confirmation email to user
     */
    if (user.email) {
      const mailer = new Mailer();
      const template = new ConfirmEmailTemplate({
        email: user.email,
        url: token.generateURL(),
      });
      await mailer.sendTemplate(user.email, template);
    }

    /**
     * End with empty response
     */
    return res.end();
  } catch (e) {
    return next(new DatabaseAccessFailure());
  }
});
