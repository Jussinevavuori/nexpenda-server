import { prisma } from "../../server";
import { ConfigUpdateFailure } from "../result/Failures";
import { Success } from "../result/Result";
import { ConfigSchema } from "../schemas/config.schema";

/**
 * Wraps functionality for a configuration item which is stored in the Config
 * table of the database as a key-value pair. Includes functionalities such
 * as fetching, updating, validating, default values and more.
 */
export class ConfigurationItem<T> {
  /**
   * Key for storing this item in the database.
   */
  key: keyof ConfigSchema;

  /**
   * Default value for this item when parsing fails.
   */
  defaultValue: T;

  /**
   * Encode a value to a string that is stored in the database
   */
  encode: (value: T) => string;

  /**
   * Decode the stringified value from the database
   */
  decode: (value: string) => T | null;

  /**
   * Validate a parsed value
   */
  validate: (value: T | null) => T | null;

  constructor(options: {
    key: ConfigurationItem<T>["key"];
    defaultValue: ConfigurationItem<T>["defaultValue"];
    encode: ConfigurationItem<T>["encode"];
    decode: ConfigurationItem<T>["decode"];
    validate: ConfigurationItem<T>["validate"];
  }) {
    this.key = options.key;
    this.defaultValue = options.defaultValue;
    this.encode = options.encode;
    this.decode = options.decode;
    this.validate = options.validate;
  }

  /**
   * Fetch the value or the default value if it does not exist or it does not
   * exist or could not be parsed or was invalid.
   */
  async fetchValue(): Promise<T> {
    // Fetch. If not found, return default value.
    const config = await prisma.config.findUnique({ where: { key: this.key } });
    if (!config) return this.defaultValue;

    // Decode and validate, if either fails return default value
    const decoded = this.decode(config.value);
    const valid = this.validate(decoded);
    if (valid === null) return this.defaultValue;

    return valid;
  }

  /**
   * Updates the value or returns a failure if the validation failed.
   */
  async updateValue(value: T) {
    // Validate or failure.
    const valid = this.validate(value);
    if (valid === null) {
      return new ConfigUpdateFailure<T>(this.key, value);
    }

    // Encode and update valid value
    const encoded = this.encode(value);
    const result = await prisma.config.update({
      where: { key: this.key },
      data: { value: encoded },
    });
    return new Success(result.value);
  }
}
