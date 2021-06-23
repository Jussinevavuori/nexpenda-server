import { configurationRouter } from "..";
import { Schemas } from "../../lib/schemas/Schemas";
import { ConfigurationService } from "../../lib/config/ConfigurationService";
import { UnauthenticatedFailure } from "../../lib/result/Failures";
import { validate } from "../../lib/validation/validate";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";

/**
 * Partially update the current application configuration as an admin user.
 */
configurationRouter.patch("/", async (req, res, next) => {
  /**
   * Authenticate as admin
   */
  if (!req.data.auth.user || !req.data.auth.user.isAdmin) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, Schemas.Config.patch);
  if (body.isFailure()) return next(body);

  /**
   * Get items from configuration service
   */
  const items = ConfigurationService.ConfigurationItems;

  /**
   * Update free transactions limit if value provided
   */
  if (body.value.freeTransactionsLimit !== undefined) {
    items.freeTransactionsLimit.updateValue(body.value.freeTransactionsLimit);
  }

  /**
   * Update free budgets limit if value provided
   */
  if (body.value.freeBudgetsLimit !== undefined) {
    items.freeBudgetsLimit.updateValue(body.value.freeBudgetsLimit);
  }

  /**
   * Update status if value provided
   */
  if (body.value.status !== undefined) {
    items.status.updateValue(body.value.status);
  }

  /**
   * Refetch config and force new values, validate and return
   */
  const config = ConfigurationService.getConfiguration({ forceRefetch: true });
  const validated = await validate(config, Schemas.Config.config);
  if (validated.isFailure()) {
    return next(validated);
  }
  return res.send(validated.value);
});
