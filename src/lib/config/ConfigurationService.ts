import { configSchema, ConfigSchema } from "../schemas/config.schema";
import { Success } from "../result/Result";
import { SimpleCache } from "../utils/SimpleCache";
import { validate } from "../validation/validate";
import { ConfigurationItem } from "./ConfigurationItem";

/**
 * Configuraton service is used to fetch and update the current configuration in
 * the database. Optimized with a simple cache.
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
    const items = ConfigurationService.ConfigurationItems;

    const config: ConfigSchema = {
      freeTransactionsLimit: await items.freeTransactionsLimit.fetchValue(),
      freeBudgetsLimit: await items.freeBudgetsLimit.fetchValue(),
      status: await items.status.fetchValue(),
    };

    return validate(config, configSchema);
  }

  /**
   * Gets the current configuration and caches it for a minute.
   */
  static async getConfiguration(
    options: {
      /**
       * When true, will not use cache but will refresh cache value
       * and return latest value. Use when updating values.
       */
      forceRefetch?: boolean;
    } = {}
  ) {
    // Use fresh cached if available
    const freshCachedConfig = ConfigurationService.Cache.getFresh();
    if (freshCachedConfig && !options.forceRefetch) {
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

  /**
   * All configuration items that are expected to be stored in the database.
   */
  static ConfigurationItems: {
    [key in keyof ConfigSchema]: ConfigurationItem<ConfigSchema[key]>;
  } = {
    /**
     * Free transactions limit defines how many transactions non-premium users
     * are allowed to create.
     */
    freeTransactionsLimit: new ConfigurationItem({
      key: "freeTransactionsLimit",
      defaultValue: 999_999,
      decode(str) {
        return parseInt(str);
      },
      encode(val) {
        return val.toFixed(0);
      },
      validate(val) {
        const parsed = configSchema.shape.freeTransactionsLimit.safeParse(val);
        if (parsed.success) {
          return parsed.data;
        }
        return null;
      },
    }),

    /**
     * Free budgets limit defines how many budgets non-premium users
     * are allowed to create.
     */
    freeBudgetsLimit: new ConfigurationItem({
      key: "freeBudgetsLimit",
      defaultValue: 999_999,
      decode(str) {
        return parseInt(str);
      },
      encode(val) {
        return val.toFixed(0);
      },
      validate(val) {
        const parsed = configSchema.shape.freeBudgetsLimit.safeParse(val);
        if (parsed.success) {
          return parsed.data;
        }
        return null;
      },
    }),

    /**
     * Status defines whether the application is currently online or offline.
     * When the status is offline, the client application displays a
     * maintenance screen. Used for maintentance purposes.
     */
    status: new ConfigurationItem<"online" | "offline">({
      key: "status",
      defaultValue: "offline",
      decode(str) {
        return str === "online" ? "online" : "offline";
      },
      encode(val) {
        return val;
      },
      validate(val) {
        const parsed = configSchema.shape.status.safeParse(val);
        if (parsed.success) {
          return parsed.data;
        }
        return null;
      },
    }),
  };
}
