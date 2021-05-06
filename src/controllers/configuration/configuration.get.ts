import { configurationRouter } from "..";
import { firestore } from "../../server";
import { validate } from "../../utils/validate";
import { configSchema } from "../../schemas/config.schema";
import { ServerInitializationFailure } from "../../utils/Failures";

configurationRouter.get("/", async (req, res, next) => {
  if (!firestore) {
    return next(new ServerInitializationFailure("Firestore not initialized"));
  }

  const configDoc = await firestore.doc("configuration/configuration").get();

  const validated = await validate(configDoc.data(), configSchema);
  if (validated.isFailure()) {
    return next(validated);
  }

  return res.send(validated.value);
});
