import { authRouter } from "../../routers";
import { prisma } from "../../server";
import { RefreshToken } from "../../lib/tokens/RefreshToken";

/**
 * Logs a user out by removing their refresh token cookie and invalidating
 * all tokens for that user.
 */
authRouter.post("/logout", async (req, res) => {
  /**
   * If user logged in, invalidate all existing tokens by incrementing
   * token version.
   */
  const user = req.data.auth.user;
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  /**
   * Clear cookie to log out
   */
  RefreshToken.clearCookie(res).end();
});
