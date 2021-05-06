import { configSchema, ConfigSchema } from "../schemas/config.schema";
import { firestore } from "../server";
import {
  FirestoreAccessFailure,
  ServerInitializationFailure,
} from "../utils/Failures";
import { Success } from "../utils/Result";
import { SimpleCache } from "../utils/SimpleCache";
import { validate } from "../utils/validate";

/**
 * Configuraton service is used to fetch the current configuration from
 * firestore. Optimized with a simple cache.
 */
export class ConfigurationService {
  /**
   * Cache the latest fetched configuration and refetch every minute
   */
  static Cache = new SimpleCache<ConfigSchema>(60_000);

  /**
   * Fetches a new configuration. Do not use elsewhere, use `getConfiguratoion`
   * instead which uses cached data.
   */
  private static async fetchConfiguration() {
    if (!firestore) {
      return new ServerInitializationFailure<ConfigSchema>(
        "Firestore not initialized"
      );
    }

    let config: any;
    try {
      const configDoc = await firestore
        .doc("configuration/configuration")
        .get();
      config = configDoc.data();
    } catch (e) {
      return new FirestoreAccessFailure().withMessage(
        `Firestore access failure: failed to fetch configuration`
      );
    }

    return validate(config, configSchema);
  }

  /**
   * Gets the current configuration and caches it for a minute.
   */
  static async getConfiguration() {
    // Use fresh cached if available
    const freshCachedConfig = ConfigurationService.Cache.getFresh();
    if (freshCachedConfig) {
      return new Success(freshCachedConfig);
    }

    // Fetch new one and handle errors
    const fetchedConfig = await ConfigurationService.fetchConfiguration();
    if (fetchedConfig.isFailure()) {
      return fetchedConfig;
    }

    // Update cache and return fresh data
    ConfigurationService.Cache.update(fetchedConfig.value);
    return fetchedConfig;
  }
}
