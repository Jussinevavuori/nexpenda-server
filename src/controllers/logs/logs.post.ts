import { logsRouter } from "..";
import { Schemas } from "../../schemas/Schemas";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

/**
 * Post a new log item to the database.
 */
logsRouter.post("/", async (req, res, next) => {
  /**
   * Require auth
   */
  if (!req.data.auth.user) return next(new UnauthenticatedFailure());

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, Schemas.Log.post);
  if (body.isFailure()) return next(body);

  /**
   * Upload log
   */
  const createdLog = await prisma.log.create({
    data: {
      ...body.value,
      User: {
        connect: {
          id: req.data.auth.user.id,
        },
      },
    },
  });

  /**
   * Respond with log ID
   */
  res.json({ id: createdLog.id });
});
