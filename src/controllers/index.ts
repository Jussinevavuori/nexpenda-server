import { Router } from "express";

export const pingRouter = Router();
export const authRouter = Router();
export const transactionsRouter = Router();
export const categoriesRouter = Router();
export const configurationRouter = Router();
export const stripeRouter = Router();

import "./ping/ping";

import "./auth/login";
import "./auth/logout";
import "./auth/register";
import "./auth/googleOauth";
import "./auth/profile.get";
import "./auth/profile.patch";
import "./auth/confirm_email";
import "./auth/refresh_token";
import "./auth/forgot_password";
import "./auth/change_password.get";
import "./auth/change_password.post";
import "./auth/request_confirm_email";

import "./categories/categories.get";

import "./transactions/transactions.get";
import "./transactions/transactions.[id].get";
import "./transactions/transactions.post";
import "./transactions/transactions.put";
import "./transactions/transactions.patch";
import "./transactions/transactions.delete";

import "./transactions/mass/transactions.mass.post";
import "./transactions/mass/transactions.mass.delete";

import "./configuration/configuration.get";
import "./configuration/configuration.patch";

import "./stripe/products.get";
import "./stripe/create_checkout_session.post";
import "./stripe/create_billing_portal_session.post";
