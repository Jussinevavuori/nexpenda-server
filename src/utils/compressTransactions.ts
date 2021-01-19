import { Category, Transaction } from "@prisma/client";
import { DataUtils } from "./DataUtils";

export type CompressedDataJson = {
  t: {
    id: string; // ID
    t: number; // Time (epoch)
    cid: string; // Category ID
    a: number; // Amount
    c?: string | undefined; // Comment
  }[];
  c: {
    id: string; // ID
    v: string; // Value
    ii: string; // Income icon
    ei: string; // Expense icon
  }[];
};

export function compressTransactions(
  transactions: Array<Transaction & { category: Category }>
): CompressedDataJson {
  const categories = DataUtils.unique(
    transactions.map((t) => t.category),
    (a, b) => a.id === b.id
  );

  return {
    t: transactions.map((t) => ({
      id: t.id,
      cid: t.categoryId,
      a: t.integerAmount,
      t: t.time.getTime(),
      c: t.comment ?? undefined,
    })),
    c: categories.map((c) => ({
      id: c.id,
      v: c.value,
      ii: c.incomeIcon,
      ei: c.expenseIcon,
    })),
  };
}
