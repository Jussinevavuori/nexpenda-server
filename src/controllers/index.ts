import { Router } from "express";

export const pagesRouter = Router();
export const pingRouter = Router();
export const authRouter = Router();
export const transactionsRouter = Router();

import "./ping/ping";

import "./auth/googleOauth";
import "./auth/login";
import "./auth/logout";
import "./auth/refresh_token";
import "./auth/register";
import "./auth/profile";
import "./auth/forgot_password";

import "./transactions/transactions.get";
import "./transactions/transactions.getbyid";
import "./transactions/transactions.post";
import "./transactions/transactions.put";
import "./transactions/transactions.patch";
import "./transactions/transactions.delete";

import "./pages/forgot_password";
