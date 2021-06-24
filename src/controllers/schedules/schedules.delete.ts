import { schedulesRouter } from "../../routers";
import { Schemas } from "../../lib/schemas/Schemas";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  ScheduleNotFoundFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { getQuery } from "../../lib/requests/getQuery";

schedulesRouter.delete("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Parse query
     */
    const query = getQuery(req, Schemas.Schedule.deleteQuery);

    /**
     * Ensure query parameters provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get schedule
     */
    const schedule = await prisma.transactionSchedule.findUnique({
      where: { id: req.params.id },
      select: { uid: true, id: true },
    });

    /**
     * Ensure schedule exists and belongs to caller
     */
    if (!schedule || schedule.uid !== req.data.auth.user.id) {
      return next(new ScheduleNotFoundFailure());
    }

    /**
     * Delete schedule
     */
    await prisma.transactionSchedule.delete({ where: { id: schedule.id } });

    /**
     * If specified, delete all transactions belonging to the schedule
     */
    if (query.deleteTransactions) {
      await prisma.transaction.deleteMany({
        where: { scheduleId: schedule.id },
      });
    }

    /**
     * Respond with 200 and ID of deleted schedule
     */
    return res.status(200).json({ id: schedule.id });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
