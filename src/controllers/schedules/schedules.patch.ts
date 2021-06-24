import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { schedulesRouter } from "../../routers";
import { Schemas } from "../../lib/schemas/Schemas";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  ScheduleNotFoundFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { prisma } from "../../server";
import { TransactionScheduleMapper } from "../../lib/dataMappers/TransactionScheduleMapper";

schedulesRouter.patch("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Schedule.patch);
    if (body.isFailure()) return next(body);

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
     * Create schedule from data
     */
    const updated = await prisma.transactionSchedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        firstOccurrence: body.value.schedule?.firstOccurrence
          ? new Date(body.value.schedule?.firstOccurrence)
          : undefined,
        occurrences: body.value.schedule?.occurrences,
        intervalType: body.value.schedule?.interval?.type,
        intervalEvery: body.value.schedule?.interval?.every,
        integerAmount: body.value.transactionTemplate?.integerAmount,
        comment: body.value.transactionTemplate?.comment,
        Category: body.value.transactionTemplate?.category
          ? {
              connectOrCreate: {
                where: {
                  unique_uid_value: {
                    uid: req.data.auth.user.id,
                    value: body.value.transactionTemplate?.category,
                  },
                },
                create: {
                  value: body.value.transactionTemplate?.category,
                  User: {
                    connect: {
                      id: req.data.auth.user.id,
                    },
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        Transactions: {
          select: {
            id: true,
          },
        },
        Category: {
          select: {
            id: true,
            value: true,
            icon: true,
          },
        },
      },
    });

    /**
     * Assign specified transactions to schedule
     */
    if (body.value.assignTransactions) {
      for (const transactionId of body.value.assignTransactions) {
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
        });
        if (transaction && transaction.uid === req.data.auth.user.id) {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { Schedule: { connect: { id: updated.id } } },
          });
        }
      }
    }

    /**
     * Update category icon if specified
     */
    if (body.value.transactionTemplate?.categoryIcon) {
      await prisma.category.update({
        where: { id: updated.categoryId },
        data: { icon: body.value.transactionTemplate.categoryIcon },
      });
    }

    /**
     * If so specified, update all transactions belonging to the schedule to
     * match the new template.
     *
     * Perform updates with separate update calls due to `updateMany` being
     * unable to update the `Category` field.
     */
    if (body.value.updateAllTransactions) {
      const updatableTransactions = await prisma.transaction.findMany({
        where: {
          uid: req.data.auth.user.id,
          Schedule: { id: updated.id },
        },
      });

      const uid = req.data.auth.user.id;
      await Promise.all(
        updatableTransactions.map((transaction) =>
          prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              integerAmount: body.value.transactionTemplate?.integerAmount,
              comment: body.value.transactionTemplate?.comment,
              Category: body.value.transactionTemplate?.category
                ? {
                    connect: {
                      unique_uid_value: {
                        uid,
                        value: body.value.transactionTemplate?.category,
                      },
                    },
                  }
                : undefined,
            },
          })
        )
      );
    }

    /**
     * Respond with mapped data
     */
    res.send(
      TransactionScheduleMapper.mapTransactionScheduleToResponse(updated)
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
