import { object, string, number, InferType } from "yup";

const id = () => string();
const uid = () => string();
const integerAmount = () => number().integer();
const time = () => number().positive().integer();
const category = () => string().min(1);
const comment = () => string();

export const postTransactionSchema = object({
  id: id(),
  uid: uid(),
  time: time().required(),
  comment: comment(),
  category: category().required(),
  integerAmount: integerAmount().required(),
}).required();

export type PostTransactionSchema = InferType<typeof postTransactionSchema>;

export const putTransactionSchema = object({
  id: id(),
  uid: uid(),
  time: time().defined().required(),
  comment: comment(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
}).required();

export type PutTransactionSchema = InferType<typeof putTransactionSchema>;

export const patchTransactionSchema = object({
  id: id(),
  uid: uid(),
  time: time(),
  comment: comment().nullable(),
  category: category(),
  integerAmount: integerAmount(),
}).required();

export type PatchTransactionSchema = InferType<typeof patchTransactionSchema>;
