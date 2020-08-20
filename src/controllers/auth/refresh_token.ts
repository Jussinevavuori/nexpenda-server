import { authRouter } from "..";
import { generateAccessTokenFromRequest } from "../../services/tokenService";
import { UnauthenticatedError } from "../../errors/UnauthenticatedError";

authRouter.get("/refresh_token", async (request, response, next) => {
  const accessToken = generateAccessTokenFromRequest(request);

  if (!accessToken) {
    return next(new UnauthenticatedError());
  }

  response.send(accessToken);
});
