import { validateRequestBody } from "../../utils/validateRequestBody";
import { schedulesRouter } from "..";
import { Schemas } from "../../schemas/Schemas";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { prisma } from "../../server";
import { TransactionScheduleMapper } from "../../services/TransactionScheduleMapper";

schedulesRouter.post("/", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Schedule.post);
    if (body.isFailure()) return next(body);

    /**
     * Create schedule from data
     */
    const created = await prisma.transactionSchedule.create({
      data: {
        firstOccurrence: new Date(body.value.firstOccurrence),
        occurrences: body.value.occurrences,
        intervalLength: body.value.intervalLength,
        intervalType: body.value.intervalType,
        integerAmount: body.value.integerAmount,
        comment: body.value.comment,
        User: {
          connect: {
            id: req.data.auth.user.id,
          },
        },
        Category: {
          connectOrCreate: {
            where: {
              unique_uid_value: {
                uid: req.data.auth.user.id,
                value: body.value.category,
              },
            },
            create: {
              value: body.value.category,
              User: {
                connect: {
                  id: req.data.auth.user.id,
                },
              },
            },
          },
        },
      },
      include: {
        Transactions: { select: { id: true } },
        Category: { select: { id: true, value: true, icon: true } },
      },
    });

    /**
     * Assign specified transactions to schedules
     */
    if (body.value.assignTransactions) {
      for (const transactionId of body.value.assignTransactions) {
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
        });
        if (transaction && transaction.uid === req.data.auth.user.id) {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { Schedule: { connect: { id: created.id } } },
          });
        }
      }
    }

    /**
     * Respond with mapped data
     */
    res.send(
      TransactionScheduleMapper.mapTransactionScheduleToResponse(created)
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
