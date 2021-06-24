import { configurationRouter } from "../../routers";
import { ConfigurationService } from "../../lib/config/ConfigurationService";

/**
 * Fetch the current application configuration.
 */
configurationRouter.get("/", async (req, res, next) => {
  /**
   * Get configuration and send to user
   */
  const configuration = await ConfigurationService.getConfiguration({});
  if (configuration.isFailure()) {
    return next(configuration);
  }

  return res.send(configuration.value);
});
