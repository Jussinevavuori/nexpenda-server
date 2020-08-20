import { Router } from "express";

export const pingRouter = Router();
export const authRouter = Router();
export const transactionsRouter = Router();

import "./ping/ping";

import "./auth/googleOauth";
import "./auth/login";
import "./auth/logout";
import "./auth/refresh_token";
import "./auth/register";

import "./transactions/transactions";
