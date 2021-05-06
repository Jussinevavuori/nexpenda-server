import { configurationRouter } from "..";
import { configSchema, patchConfigSchema } from "../../schemas/config.schema";
import { firestore } from "../../server";
import {
  ServerInitializationFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { validate } from "../../utils/validate";
import { validateRequestBody } from "../../utils/validateRequestBody";

configurationRouter.patch("/", async (req, res, next) => {
  if (!firestore) {
    return next(new ServerInitializationFailure("Firestore not initialized"));
  }

  if (!req.data.auth.user || !req.data.auth.user.isAdmin) {
    return next(new UnauthenticatedFailure());
  }

  const body = await validateRequestBody(req, patchConfigSchema);
  if (body.isFailure()) {
    return next(body);
  }

  await firestore.doc("configuration/configuration").update(body.value);
  const configDoc = await firestore.doc("configuration/configuration").get();

  const validated = await validate(configDoc.data(), configSchema);
  if (validated.isFailure()) {
    return next(validated);
  }

  return res.send(validated.value);
});
