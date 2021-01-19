import { Category, Transaction } from "@prisma/client";

export type TransactionMappable = Transaction & { category: Category };

export type TransactionResponse = {
  id: string;
  time: number;
  integerAmount: number;
  comment?: string | undefined;
  category: {
    id: string;
    value: string;
    incomeIcon: string;
    expenseIcon: string;
  };
};

export function mapTransactionToResponse(
  transaction: TransactionMappable
): TransactionResponse;

export function mapTransactionToResponse(
  transaction: TransactionMappable[]
): TransactionResponse[];

export function mapTransactionToResponse(
  transaction: TransactionMappable | TransactionMappable[]
): TransactionResponse | TransactionResponse[] {
  if (Array.isArray(transaction)) {
    return transaction.map((t) => mapTransactionToResponse(t));
  } else {
    return {
      id: transaction.id,
      time: transaction.time.getTime(),
      integerAmount: transaction.integerAmount,
      comment: transaction.comment ?? undefined,
      category: {
        id: transaction.category.id,
        value: transaction.category.value,
        incomeIcon: transaction.category.incomeIcon,
        expenseIcon: transaction.category.expenseIcon,
      },
    };
  }
}
