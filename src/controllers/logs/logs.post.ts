import { logsRouter } from "..";
import { postLogSchema } from "../../schemas/logs.schema";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

logsRouter.post("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  // Validate request body
  const body = await validateRequestBody(req, postLogSchema);
  if (body.isFailure()) {
    return next(body);
  }

  // Upload feedback
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

  // End
  res.json({ id: createdLog.id });
});
