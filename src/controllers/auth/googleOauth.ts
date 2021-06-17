import { authRouter } from "..";
import * as passport from "passport";
import { redirect } from "../../utils/redirect";
import { prisma } from "../../server";
import { RefreshToken } from "../../tokens/RefreshToken";
import { getUrl } from "../../utils/getUrl";

/**
 * OAuth starting endpoint for Google with passport
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

/**
 * OAuth callback endpoint for Google with passport
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: getUrl.toFrontend("/login"),
  }),
  async (request, response, next) => {
    try {
      const id = (request.user as any)?.id;
      const googleId = (request.user as any)?.googleId;

      if (id && googleId) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (user && googleId === user.googleId) {
          new RefreshToken(user, prisma).sendCookie(response);
          return redirect(response).toFrontend("/app");
        }
      }
      throw Error();
    } catch (error) {
      return redirect(response).toFrontend("/login");
    }
  }
);
