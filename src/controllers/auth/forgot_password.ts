import { authRouter } from "..";
import { prisma } from "../../server";
import { protectedRoute } from "../../middleware/protectedRoute";
import { v4 as uuid } from "uuid";
import { conf } from "../../conf";
import { addHours } from "date-fns";

authRouter.post(
  "/forgot_password",
  protectedRoute(async (user, request, response, next) => {
    const now = new Date();

    const expiresAt = addHours(now, conf.auth.fogotPassword.expiresInHours);

    try {
      const authLink = prisma.authLink.create({
        data: {
          id: uuid(),
          code: uuid(),
          createdAt: now,
          expiresAt,
          type: "FORGOT_PASSWORD",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } catch (e) {
      return next(e);
    }
  })
);
