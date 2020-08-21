import { Transaction } from "../../entity/transaction.entity";
import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { UnimplementedError } from "../../errors/UnimplementedError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import {
  postTransactionConstructableSchema,
  patchTransactionConstructableSchema,
  putTransactionConstructableSchema,
} from "../schemas/transactionConstructable.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { UnknownApplicationError } from "../../errors/UnknownApplicationError";

transactionsRouter.get(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const transactions = await Transaction.find({ where: { uid: user.id } });
      res.json(
        transactions
          .map((_) => _.toResponseConstructable())
          .sort((a, b) => a.date - b.date)
      );
    } catch (error) {
      next(error);
    }
  })
);

transactionsRouter.get(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;

      const transaction = await getProtectedTransaction(user, id);

      if (!transaction) {
        throw new TransactionNotFoundError();
      }

      return res.json(transaction.toResponseConstructable());
    } catch (error) {
      next(error);
    }
  })
);

transactionsRouter.post(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const form = await getValidatedRequestBody(
        req,
        postTransactionConstructableSchema
      );

      const created = await Transaction.createFromPostConstructable(form, user);

      return res.status(201).json(created.toResponseConstructable());
    } catch (error) {
      next(error);
    }
  })
);

transactionsRouter.patch(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;

      const transaction = await getProtectedTransaction(user, id);

      if (!transaction) {
        throw new TransactionNotFoundError();
      }

      const form = await getValidatedRequestBody(
        req,
        patchTransactionConstructableSchema
      );

      const updated = await transaction.updateWithPatchConstructable(form);

      if (!updated) throw new UnknownApplicationError();

      return res.json(updated.toResponseConstructable());
    } catch (error) {
      next(error);
    }
    next(new UnimplementedError());
  })
);

transactionsRouter.put(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;

      const transaction = await getProtectedTransaction(user, id);

      const form = await getValidatedRequestBody(
        req,
        putTransactionConstructableSchema
      );

      if (transaction) {
        const updated = await transaction.updateWithPutConstructable(form);
        if (!updated) throw new UnknownApplicationError();
        return res.json(updated.toResponseConstructable());
      } else {
        const created = await Transaction.createFromPutConstructable(
          id,
          form,
          user
        );
        return res.json(created.toResponseConstructable());
      }
    } catch (error) {
      next(error);
    }
  })
);

transactionsRouter.delete(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;

      const transaction = await getProtectedTransaction(user, id);

      if (!transaction) {
        throw new TransactionNotFoundError();
      }

      await transaction.remove();

      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  })
);

export default transactionsRouter;
