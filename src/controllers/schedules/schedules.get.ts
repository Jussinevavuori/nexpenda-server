import { schedulesRouter } from "../../routers";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { prisma } from "../../server";
import { TransactionScheduleMapper } from "../../lib/dataMappers/TransactionScheduleMapper";

schedulesRouter.get("/", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Get schedules for user
     */
    const schedules = await prisma.transactionSchedule.findMany({
      where: { uid: req.data.auth.user.id },
      include: { Category: { select: { id: true, value: true, icon: true } } },
    });

    /**
     * Respond with mapped data
     */
    res.json(
      TransactionScheduleMapper.mapTransactionScheduleToResponse(schedules)
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
