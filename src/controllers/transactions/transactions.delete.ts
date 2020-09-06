import { transactionsRouter } from "..";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { Route } from "../../utils/Route";

new Route(transactionsRouter, "/:id").protected.delete(
  async (user, req, res) => {
    /**
     * Get ID from request params
     */
    const id = req.params.id;

    /**
     * Find user's transaction with given ID
     */
    const transaction = await getProtectedTransaction(user, id);

    if (transaction.isFailure()) {
      return transaction;
    }

    /**
     * Delete transaction
     */
    await prisma.transaction.delete({ where: { id: transaction.value.id } });

    /**
     * Respond with 204
     */
    res.status(204).end();
  }
);
