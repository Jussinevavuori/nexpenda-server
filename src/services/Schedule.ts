import * as dateFns from "date-fns";
import { ScheduleInterval } from "../schemas/schedule.schema";
import { ErrorFailure } from "../utils/Failures";
import { Success } from "../utils/Result";
import { ScheduleIntervalSerializer } from "./ScheduleIntervalSerializer";

type ScheduleConstructorArgument = {
  intervalStr: string;
  firstOccurence: Date;
  lastOccurence?: Date;
	lastOccurenceSpecification: 
};

export class Schedule {
  /**
   * The repeat interval. Contains information about how often the schedule
   * should occur.
   */
  public readonly interval: ScheduleInterval;

  /**
   * The first occurence.
   */
  public readonly firstOccurence: Date;

  /**
   * Last occurence.
   */
  public readonly lastOccurence: Date;

	/**
	 * Type
	 */

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

    this.firstOccurence = args.firstOccurence;
    this.lastOccurence = args.lastOccurence;
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
   * Get the next occurence. If the event occurs today, returns today's
   * occurence.
   */
  nextOccurence(): Date {
    throw new Error("Unimplemented");
  }

  /**
   * Number of total occurences.
   */
  getTotalOccurences(): number {
    throw new Error("Unimplemented");
  }

  /**
   * Check whether the schedule is still active (last occurence not passed).
   */
  isActive(): boolean {
    // If no termination date, schedule will never terminate
    if (!this.lastOccurence) {
      return true;
    }

    const today = dateFns.startOfDay(new Date());
    const last = dateFns.startOfDay(this.lastOccurence);
    return !dateFns.isAfter(last, today);
  }

  /**
   * To schedule string.
   */
  getIntervalString() {
    return ScheduleIntervalSerializer.serialize(this);
  }

  /**
   * Determine the last occurence when the first occurence, number of
   * occurences and the specified interval is known.
   */
  static getLastOccurence(args: {
    firstOccurence: Date;
    occurences: number;
    interval: ScheduleInterval;
  }): Date {
    // Shorthand to first occurence as first. Ensure first is set to start
    // of day for proper calculations.
    const first = dateFns.startOfDay(args.firstOccurence);

    // Number of occurences. Forced to be an integer greater than one by flooring
    // and limiting to 1 at minimum.
    const occurences = Math.max(1, Math.floor(args.occurences));

    // Duration in units of time specified by interval
    const duration = args.interval.every * (occurences - 1);

    // Based on type of interval, add days, weeks, months or years to
    // first date to get correct terminate after date.
    switch (args.interval.type) {
      case "day": {
        return dateFns.addDays(first, duration);
      }
      case "week": {
        return dateFns.addWeeks(first, duration);
      }
      case "month": {
        return dateFns.addMonths(first, duration);
      }
      case "year": {
        return dateFns.addYears(first, duration);
      }
    }
  }
}
