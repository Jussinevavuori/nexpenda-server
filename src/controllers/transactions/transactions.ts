import { Transaction } from "../../entity/transaction.entity";
import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { UnimplementedError } from "../../errors/UnimplementedError";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { Request, Response, NextFunction } from "express";
import { User } from "../../entity/user.entity";

function withProtectedTransaction(
  resolver: (
    transaction: Transaction,
    user: User,
    req: Request,
    res: Response,
    next: NextFunction
  ) => any
) {
  return async (
    user: User,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params["id"];

      if (!id) {
        throw new InvalidRequestDataError("No ID provided as URL parameter");
      }

      const transaction = await Transaction.findOne(id);

      if (!transaction) {
        return next(new TransactionNotFoundError());
      }

      if (transaction.uid !== user.id) {
        return next(new TransactionNotFoundError());
      }

      return resolver(transaction, user, req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

transactionsRouter.get(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const transactions = await Transaction.find({ where: { uid: user.id } });
      res.json(
        transactions
          .map((_) => _.toConstructable())
          .sort((a, b) => a.date - b.date)
      );
    } catch (error) {
      console.log("And here as welll...", { error });
      next(error);
    }
  })
);

transactionsRouter.post(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const constructable = await getValidatedRequestBody(
        req,
        Transaction.constructableSchema
      );

      if (constructable.uid !== user.id) {
        throw new InvalidRequestDataError("Unauthorized UID in request body");
      }

      const transaction = await Transaction.fromConstructable(
        constructable,
        user
      ).save();

      return res.status(201).json(transaction.toConstructable());
    } catch (error) {
      next(error);
    }
  })
);

transactionsRouter.get(
  "/:id",
  protectedRoute(
    withProtectedTransaction(async (transaction, user, req, res, next) => {
      return res.json(transaction.toConstructable());
    })
  )
);

transactionsRouter.patch(
  "/:id",
  protectedRoute(
    withProtectedTransaction(async (transaction, user, req, res, next) => {
      next(new UnimplementedError());
    })
  )
);

transactionsRouter.put(
  "/:id",
  protectedRoute(
    withProtectedTransaction(async (transaction, user, req, res, next) => {
      next(new UnimplementedError());
    })
  )
);

transactionsRouter.delete(
  "/:id",
  protectedRoute(
    withProtectedTransaction(async (transaction, user, req, res, next) => {
      try {
        await transaction.remove();
        return res.status(204).end();
      } catch (error) {
        next(error);
      }
    })
  )
);

export default transactionsRouter;
