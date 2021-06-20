import * as dateFns from "date-fns";
import { ScheduleInterval } from "../schemas/schedule.schema";
import { ErrorFailure } from "../utils/Failures";
import { Success } from "../utils/Result";
import { ScheduleIntervalSerializer } from "./ScheduleIntervalSerializer";

type ScheduleConstructorArgument = {
  intervalStr: string;
  firstOccurrence: Date;
  occurrences?: number;
};

/**
 * A schedule is used to schedule repeating transactions. A schedule contains
 * occurrences. A schedule must define its first occurrence which is the first
 * date when an event or transaction is scheduled to occur. A schedule will also
 * contain an interval, which can be used to deduce all the following
 * occurrences. A schedule may also contain a last occurrence which is used to
 * end a schedule.
 */
export class Schedule {
  /**
   * The repeat interval. Contains information about how often the schedule
   * should occur.
   */
  public readonly interval: ScheduleInterval;

  /**
   * Date of first occurrence.
   */
  public readonly firstOccurrence: Date;

  /**
   * Total number of occurrences.
   */
  public readonly occurrences?: number;

  /**
   * Do not use the constructor directly as the constructor may throw errors.
   * Use `Schedule.From()` instead to get a result object.
   */
  constructor(args: ScheduleConstructorArgument) {
    // Parse and validate schedule interval.
    const interval = ScheduleIntervalSerializer.deserialize(args.intervalStr);
    if (interval.isSuccess()) {
      this.interval = interval.value;
    } else {
      throw new Error("Could not parse schedule string");
    }

    this.firstOccurrence = args.firstOccurrence;
    this.occurrences = args.occurrences;
  }

  /**
   * Wrapper for constructor to handle errors as failures.
   */
  static From(args: ScheduleConstructorArgument) {
    try {
      const schedule = new Schedule(args);
      return new Success(schedule);
    } catch (e) {
      return new ErrorFailure(e);
    }
  }

  /**
   * Check whether the schedule is set to occur today.
   */
  occursToday(): boolean {
    throw new Error("Unimplemented");
  }

  /**
   * Get the next occurrence. If the event occurs today, returns today's
   * occurrence.
   */
  nextOccurrence(): Date {
    throw new Error("Unimplemented");
  }

  /**
   * Last occurrence. Returns undefined if there is no last occurrence.
   */
  getLastOccurrence(): Date | undefined {
    if (!this.occurrences) return undefined;
    return Schedule.getLastOccurrence({
      firstOccurrence: this.firstOccurrence,
      occurrences: this.occurrences,
      interval: this.interval,
    });
  }

  /**
   * Check whether the schedule is still active (last occurrence not passed).
   */
  isActive(): boolean {
    // If no termination date, schedule will never terminate
    const lastOccurrence = this.getLastOccurrence();
    if (!lastOccurrence) {
      return true;
    }

    const today = dateFns.startOfDay(new Date());
    const last = dateFns.startOfDay(lastOccurrence);
    return !dateFns.isAfter(last, today);
  }

  /**
   * To schedule string.
   */
  getIntervalString() {
    return ScheduleIntervalSerializer.serialize(this);
  }

  /**
   * Determine the last occurrence when the first occurrence, number of
   * occurrences and the specified interval is known.
   */
  static getLastOccurrence(args: {
    firstOccurrence: Date;
    occurrences: number;
    interval: ScheduleInterval;
  }): Date {
    // Shorthand to first occurrence as first. Ensure first is set to start
    // of day for proper calculations.
    const first = dateFns.startOfDay(args.firstOccurrence);

    // Number of occurrences. Forced to be an integer greater than one by flooring
    // and limiting to 1 at minimum.
    const occurrences = Math.max(1, Math.floor(args.occurrences));

    // Duration in units of time specified by interval
    const duration = args.interval.every * (occurrences - 1);

    // Based on type of interval, add days, weeks, months or years to
    // first date to get correct terminate after date.
    switch (args.interval.type) {
      case "DAY": {
        return dateFns.addDays(first, duration);
      }
      case "WEEK": {
        return dateFns.addWeeks(first, duration);
      }
      case "MONTH": {
        return dateFns.addMonths(first, duration);
      }
      case "YEAR": {
        return dateFns.addYears(first, duration);
      }
    }
  }
}
