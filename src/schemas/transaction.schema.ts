import { object, string, number, InferType } from "yup";

const id = () => string();
const uid = () => string();
const integerAmount = () => number().integer();
const time = () => number().positive().integer();
const category = () => string().min(1);
const comment = () => string();

export const postTransactionSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  time: time().defined().required(),
  comment: comment().optional(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
})
  .defined()
  .required();

export type PostTransactionSchema = InferType<typeof postTransactionSchema>;

export const putTransactionSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  time: time().defined().required(),
  comment: comment().optional(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
})
  .defined()
  .required();

export type PutTransactionSchema = InferType<typeof putTransactionSchema>;

export const patchTransactionSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  time: time().optional(),
  comment: comment().optional().nullable(),
  category: category().optional(),
  integerAmount: integerAmount().optional(),
})
  .defined()
  .required();

export type PatchTransactionSchema = InferType<typeof patchTransactionSchema>;
