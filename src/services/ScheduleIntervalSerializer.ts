import { Schedule } from "./Schedule";
import { Success } from "../utils/Result";
import { scheduleIntervalSchema } from "../schemas/schedule.schema";
import { ErrorFailure } from "../utils/Failures";

/**
 * Utility class for serializing and deserializing intervals fpor schedules.
 * Uses a JSON.parse and JSON.stringify together with validation.
 */
export class ScheduleIntervalSerializer {
  /**
   * Deserialize a serialized interval string into a valid schedule interval.
   * Returns a result in case of failure during deserialization.
   *
   * Uses JSON.parse and Zod validation internally.
   */
  static deserialize(str: string) {
    try {
      const parsed = JSON.parse(str);
      const validated = scheduleIntervalSchema.parse(parsed);
      return new Success(validated);
    } catch (e) {
      return new ErrorFailure(e);
    }
  }

  /**
   * Serializes an interval object into a string.
   *
   * Uses JSON.stringify internally.
   */
  static serialize(schedule: Schedule): string {
    return JSON.stringify(schedule.interval);
  }
}
