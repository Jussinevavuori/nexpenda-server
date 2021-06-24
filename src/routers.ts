import { Router } from "express";

/**
 * Root router registers all subrouters
 */
export const rootRouter = Router();

/**
 * Auth router
 */
export const authRouter = Router();
import "./controllers/auth/login";
import "./controllers/auth/logout";
import "./controllers/auth/register";
import "./controllers/auth/googleOauth";
import "./controllers/auth/confirm_email";
import "./controllers/auth/refresh_token";
import "./controllers/auth/reset_password";
import "./controllers/auth/change_password.get";
import "./controllers/auth/change_password.post";
import "./controllers/auth/request_confirm_email";
rootRouter.use("/auth", authRouter);

/**
 * Avatar router
 */
export const avatarRouter = Router();
import "./controllers/avatar/avatar.post";
import "./controllers/avatar/avatar.delete";
import "./controllers/avatar/avatar.put";
rootRouter.use("/avatar", avatarRouter);

/**
 * Budgets router
 */
export const budgetsRouter = Router();
import "./controllers/budgets/budgets.get";
import "./controllers/budgets/budgets.[id].get";
import "./controllers/budgets/budgets.post";
import "./controllers/budgets/budgets.delete";
import "./controllers/budgets/budgets.patch";
import "./controllers/budgets/budgets.put";
rootRouter.use("/budgets", budgetsRouter);

/**
 * Categories router
 */
export const categoriesRouter = Router();
import "./controllers/categories/categories.get";
rootRouter.use("/categories", categoriesRouter);

/**
 * Configuratoins router
 */
export const configurationRouter = Router();
import "./controllers/configuration/configuration.get";
import "./controllers/configuration/configuration.patch";
rootRouter.use("/config", configurationRouter);

/**
 * Feedback router
 */
export const feedbackRouter = Router();
import "./controllers/feedback/feedback.post";
rootRouter.use("/feedback", feedbackRouter);

/**
 * Logs router
 */
export const logsRouter = Router();
import "./controllers/logs/logs.post";
rootRouter.use("/logs", logsRouter);

/**
 * Ping router
 */
export const pingRouter = Router();
import "./controllers/ping/ping.get";
import "./controllers/ping/ping.protected.get";
rootRouter.use("/ping", pingRouter);

/**
 * Profile router
 */
export const profileRouter = Router();
import "./controllers/profile/profile.get";
import "./controllers/profile/profile.patch";
rootRouter.use("/profile", profileRouter);

/**
 * Schedules router
 */
export const schedulesRouter = Router();
import "./controllers/schedules/schedules.get";
import "./controllers/schedules/schedules.post";
import "./controllers/schedules/schedules.patch";
import "./controllers/schedules/schedules.delete";
import "./controllers/schedules/create_scheduled.post";
rootRouter.use("/schedules", schedulesRouter);

/**
 * Stripe router
 */
export const stripeRouter = Router();
import "./controllers/stripe/webhook.post";
import "./controllers/stripe/products.get";
import "./controllers/stripe/checkout_session.get";
import "./controllers/stripe/create_checkout_session.post";
import "./controllers/stripe/create_billing_portal_session.post";
rootRouter.use("/stripe", stripeRouter);

/**
 * Transactions router
 */
export const transactionsRouter = Router();
import "./controllers/transactions/transactions.get";
import "./controllers/transactions/transactions.[id].get";
import "./controllers/transactions/transactions.post";
import "./controllers/transactions/transactions.put";
import "./controllers/transactions/transactions.patch";
import "./controllers/transactions/transactions.delete";
import "./controllers/transactions/transactions.mass.post";
import "./controllers/transactions/transactions.mass.delete";
rootRouter.use("/transactions", transactionsRouter);
