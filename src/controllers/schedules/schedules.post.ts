import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { schedulesRouter } from "../../routers";
import { Schemas } from "../../lib/schemas/Schemas";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { prisma } from "../../server";
import { TransactionScheduleMapper } from "../../lib/dataMappers/TransactionScheduleMapper";

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
        firstOccurrence: new Date(body.value.schedule.firstOccurrence),
        occurrences: body.value.schedule.occurrences || undefined,
        intervalEvery: body.value.schedule.interval.every,
        intervalType: body.value.schedule.interval.type,
        integerAmount: body.value.transactionTemplate.integerAmount,
        comment: body.value.transactionTemplate.comment,
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
                value: body.value.transactionTemplate.category,
              },
            },
            create: {
              value: body.value.transactionTemplate.category,
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
     * Update category icon if specified
     */
    if (body.value.transactionTemplate.categoryIcon) {
      await prisma.category.update({
        where: { id: created.categoryId },
        data: { icon: body.value.transactionTemplate.categoryIcon },
      });
    }

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
