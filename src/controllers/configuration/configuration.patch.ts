import { configurationRouter } from "..";
import { configSchema, patchConfigSchema } from "../../schemas/config.schema";
import { ConfigurationService } from "../../services/ConfigurationService";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validate } from "../../utils/validate";
import { validateRequestBody } from "../../utils/validateRequestBody";

configurationRouter.patch("/", async (req, res, next) => {
  // Authenticate as admin
  if (!req.data.auth.user || !req.data.auth.user.isAdmin) {
    return next(new UnauthenticatedFailure());
  }

  // Validate body
  const body = await validateRequestBody(req, patchConfigSchema);
  if (body.isFailure()) {
    return next(body);
  }

  // Shorthand
  const items = ConfigurationService.ConfigurationItems;

  // Update freeTransactionsLimit
  if (body.value.freeTransactionsLimit !== undefined) {
    items.freeTransactionsLimit.updateValue(body.value.freeTransactionsLimit);
  }

  // Update freeBudgetsLimit
  if (body.value.freeBudgetsLimit !== undefined) {
    items.freeBudgetsLimit.updateValue(body.value.freeBudgetsLimit);
  }

  // Update status
  if (body.value.status !== undefined) {
    items.status.updateValue(body.value.status);
  }

  // Refetch config and force new values, validate and return
  const config = ConfigurationService.getConfiguration({ forceRefetch: true });
  const validated = await validate(config, configSchema);
  if (validated.isFailure()) {
    return next(validated);
  }
  return res.send(validated.value);
});
