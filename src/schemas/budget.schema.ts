import * as z from "zod";

export const budgetSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  integerAmount: z.number().int(),
  categoryIds: z.array(z.string()),
  periodMonths: z.number().positive().int().min(1).max(12).optional(),
});

export const postBudgetSchema = budgetSchema.omit({ id: true });
export const putBudgetSchema = budgetSchema.omit({ id: true });
export const patchBudgetSchema = budgetSchema
  .partial()
  .omit({ id: true })
  .extend({ label: z.string().optional().nullable() });

export type BudgetSchema = z.TypeOf<typeof budgetSchema>;
export type PostBudgetSchema = z.TypeOf<typeof postBudgetSchema>;
export type PutBudgetSchema = z.TypeOf<typeof putBudgetSchema>;
export type PatchBudgetSchema = z.TypeOf<typeof patchBudgetSchema>;
