import { isSameDay } from "date-fns";
import { schedulesRouter } from "../../routers";
import { prisma } from "../../server";
import { Schedule } from "../../lib/schedules/Schedule";
import {
  TransactionMapper,
  TransactionResponseMappable,
} from "../../lib/dataMappers/TransactionMapper";
import { compareDate } from "../../lib/dates/compareDate";
import { DateSerializer } from "../../lib/dates/DateSerializer";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { groupByDateSerialToMap } from "../../lib/dates/groupByDateSerialToMap";

/**
 * Endpoint to create all scheduled transactions that are due until this date.
 * Returns the created transactions in an array.
 */
schedulesRouter.post("/create_scheduled", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Get all transactions and schedules
     */
    const transactions = await prisma.transaction.findMany({
      where: {
        User: { id: req.data.auth.user.id },
        scheduleId: { not: null },
      },
    });
    const schedules = await prisma.transactionSchedule.findMany({
      where: { User: { id: req.data.auth.user.id } },
    });

    /**
     * Create map of transactions by their dates
     */
    const transactionsByDates = groupByDateSerialToMap(
      transactions,
      (t) => t.time
    );

    /**
     * List of created transactions
     */
    const created: TransactionResponseMappable[] = [];

    /**
     * Run through each schedule
     */
    for (const transactionSchedule of schedules) {
      // Memorize new latest created occurrence if new occurrences are created
      let newLatestCreatedOccurrence: Date | null = null;

      // Create schedule object for iterating over occurrences
      const schedule = new Schedule({
        firstOccurrence: transactionSchedule.firstOccurrence,
        occurrences: transactionSchedule.occurrences ?? undefined,
        interval: {
          type: transactionSchedule.intervalType,
          every: transactionSchedule.intervalEvery,
        },
      });

      // Get first date for looping: start looping from next occurrence from
      // either the last created occurrence if one exists, else use the  first
      // occurrence.
      const firstDate = (() => {
        const latest = transactionSchedule.latestCreatedOccurrence;
        if (latest) {
          const next = schedule.getNextOccurrence(latest);
          if (next) return next;
        }

        // Default
        return transactionSchedule.firstOccurrence;
      })();

      // Get last date to loop to: if a last occurrence exists and is before
      // today, use it. By default use today.
      const lastDate = (() => {
        const last = schedule.getLastOccurrence();
        const today = new Date();
        if (last && compareDate(last, "<", today)) {
          return last;
        }

        // Default
        return today;
      })();

      // Loop for every occurrence from first date to last date
      let date = firstDate;
      while (compareDate(date, "<=", lastDate)) {
        // Find existing transaction if one already created for
        // same schedule and specified date
        const serial = DateSerializer.serializeDate(date);
        const transactionGroup = transactionsByDates[serial] ?? [];
        const existing = transactionGroup.find(
          (t) =>
            t.scheduleId === transactionSchedule.id && isSameDay(date, t.time)
        );

        // If no existing occurrence found, create occurrence
        if (!existing) {
          const occurrence = await prisma.transaction.create({
            data: {
              User: { connect: { id: req.data.auth.user.id } },
              Category: { connect: { id: transactionSchedule.categoryId } },
              integerAmount: transactionSchedule.integerAmount,
              comment: transactionSchedule.comment,
              time: date,
              Schedule: { connect: { id: transactionSchedule.id } },
            },
            include: {
              Category: true,
              Schedule: true,
            },
          });

          // Memorize new latest created occurrence
          newLatestCreatedOccurrence = date;

          created.push(occurrence);
        }

        // Iterate to next occurrence
        const next = schedule.getNextOccurrence(date);
        if (!next || isSameDay(date, next)) break;
        date = next;
      }

      // Update latest created occurrence of scheule in order to not
      // create same schedules again, even if they are deleted.
      if (newLatestCreatedOccurrence) {
        await prisma.transactionSchedule.update({
          where: { id: transactionSchedule.id },
          data: { latestCreatedOccurrence: newLatestCreatedOccurrence },
        });
      }
    }

    // Respond with created transactions
    res.json(TransactionMapper.mapTransactionsToResponse(created));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
