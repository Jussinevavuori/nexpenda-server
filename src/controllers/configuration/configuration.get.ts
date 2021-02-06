import { configurationRouter } from "..";
import { firestore } from "../../server";
import { validate } from "../../utils/validate";
import { configSchema } from "../../schemas/config.schema";

configurationRouter.get("/", async (req, res, next) => {
  const configDoc = await firestore.doc("configuration/configuration").get();

  const validated = await validate(configDoc.data(), configSchema);
  if (validated.isFailure()) {
    return next(validated);
  }

  return res.send(validated.value);
});
