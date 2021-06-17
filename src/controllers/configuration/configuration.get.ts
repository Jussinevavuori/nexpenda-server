import { configurationRouter } from "..";
import { ConfigurationService } from "../../services/ConfigurationService";

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
