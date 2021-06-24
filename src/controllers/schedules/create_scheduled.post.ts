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
    for (const schedule of schedules) {
      // Create schedule object for iterating over occurrences
      const S = new Schedule({
        firstOccurrence: schedule.firstOccurrence,
        occurrences: schedule.occurrences ?? undefined,
        interval: {
          type: schedule.intervalType,
          every: schedule.intervalEvery,
        },
      });

      // Get first date for looping: start looping from next occurrence from
      // either the last created occurrence if one exists, else use the  first
      // occurrence.
      const firstDate = (() => {
        const latest = schedule.latestCreatedOccurrence;
        if (latest) {
          const next = S.getNextOccurrence(latest);
          if (next) return next;
        }

        // Default
        return schedule.firstOccurrence;
      })();

      // Get last date to loop to: if a last occurrence exists and is before
      // today, use it. By default use today.
      const lastDate = (() => {
        const last = S.getLastOccurrence();
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
          (t) => t.scheduleId === schedule.id && isSameDay(date, t.time)
        );

        // If no existing occurrence found, create occurrence
        if (!existing) {
          console.log(`>     Creating`);
          const occurrence = await prisma.transaction.create({
            data: {
              User: { connect: { id: req.data.auth.user.id } },
              Category: { connect: { id: schedule.categoryId } },
              integerAmount: schedule.integerAmount,
              comment: schedule.comment,
              time: date,
              Schedule: { connect: { id: schedule.id } },
            },
            include: {
              Category: true,
              Schedule: true,
            },
          });
          created.push(occurrence);
        }

        // Iterate to next occurrence
        const next = S.getNextOccurrence(date);
        if (!next || isSameDay(date, next)) break;
        date = next;
      }

      // Update latest created occurrence of scheule in order to not
      // create same schedules again, even if they are deleted.
      await prisma.transactionSchedule.update({
        where: { id: schedule.id },
        data: { latestCreatedOccurrence: date },
      });
    }

    // Respond with created transactions
    res.json(TransactionMapper.mapTransactionsToResponse(created));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
