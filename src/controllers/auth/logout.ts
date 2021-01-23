import { authRouter } from "..";
import { prisma } from "../../server";
import { RefreshToken } from "../../services/RefreshToken";

authRouter.post("/logout", async (req, res) => {
  // Update user token version to invalidate all other JWT
  // sessions.
  const user = req.data.auth.user;
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  }

  // Clear cookie
  RefreshToken.clearCookie(res).end();
});
