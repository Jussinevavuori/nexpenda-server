import { configurationRouter } from "..";
import { ConfigurationService } from "../../services/ConfigurationService";

configurationRouter.get("/", async (req, res, next) => {
  const configuration = await ConfigurationService.getConfiguration();
  if (configuration.isFailure()) {
    return next(configuration);
  }

  return res.send(configuration.value);
});
