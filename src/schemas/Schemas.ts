import {
  emailOnlyAuthSchema,
  fullAuthSchema,
  idAuthSchema,
  passwordOnlyAuthSchema,
} from "./auth.schema";
import { putAvatarSchema } from "./avatar.schema";
import {
  budgetSchema,
  patchBudgetSchema,
  postBudgetSchema,
  putBudgetSchema,
} from "./budget.schema";
import { configSchema, patchConfigSchema } from "./config.schema";
import { feedbackSchema, postFeedbackSchema } from "./feedback.schema";
import { logSchema, postLogSchema } from "./logs.schema";
import { patchProfileSchema } from "./profile.schema";
import {
  postScheduleSchema,
  patchScheduleSchema,
  scheduleIntervalSchema,
  deleteScheduleQuerySchema,
} from "./schedule.schema";
import { createCheckoutSessionBodySchema } from "./stripe.schema";
import {
  deleteManyTransactionsSchema,
  getTransactionsQuerySchema,
  patchTransactionSchema,
  postTransactionSchema,
  postManyTransactionsSchema,
  putTransactionSchema,
  transactionSchema,
} from "./transaction.schema";

/**
 * Export all schemas
 */
export const Schemas = {
  Auth: {
    id: idAuthSchema,
    emailOnly: emailOnlyAuthSchema,
    passwordOnly: passwordOnlyAuthSchema,
    full: fullAuthSchema,
  },
  Avatar: {
    put: putAvatarSchema,
  },
  Budget: {
    budget: budgetSchema,
    post: postBudgetSchema,
    patch: patchBudgetSchema,
    put: putBudgetSchema,
  },
  Config: {
    config: configSchema,
    patch: patchConfigSchema,
  },
  Feedback: {
    feedback: feedbackSchema,
    post: postFeedbackSchema,
  },
  Log: {
    log: logSchema,
    post: postLogSchema,
  },
  Profile: {
    patch: patchProfileSchema,
  },
  Schedule: {
    interval: scheduleIntervalSchema,
    post: postScheduleSchema,
    patch: patchScheduleSchema,
    deleteQuery: deleteScheduleQuerySchema,
  },
  Stripe: {
    createCheckoutSession: createCheckoutSessionBodySchema,
  },
  Transaction: {
    transaction: transactionSchema,
    post: postTransactionSchema,
    put: putTransactionSchema,
    patch: patchTransactionSchema,
    deleteMany: deleteManyTransactionsSchema,
    postMany: postManyTransactionsSchema,
    getQuery: getTransactionsQuerySchema,
  },
};
