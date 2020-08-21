import { object, string, number, InferType } from "yup";

const id = () => string();
const uid = () => string();
const integerAmount = () => number().integer();
const date = () => number().positive().integer();
const category = () => string().min(1);
const comment = () => string();

export const responseTransactionConstructableSchema = object({
  id: id().defined().required(),
  uid: uid().defined().required(),
  date: date().defined().required(),
  comment: comment().optional(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
})
  .defined()
  .required();

export type ResponseTransactionConstructableSchema = InferType<
  typeof responseTransactionConstructableSchema
>;

export const postTransactionConstructableSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  date: date().defined().required(),
  comment: comment().optional(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
})
  .defined()
  .required();

export type PostTransactionConstructableSchema = InferType<
  typeof postTransactionConstructableSchema
>;

export const putTransactionConstructableSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  date: date().defined().required(),
  comment: comment().optional(),
  category: category().defined().required(),
  integerAmount: integerAmount().defined().required(),
})
  .defined()
  .required();

export type PutTransactionConstructableSchema = InferType<
  typeof putTransactionConstructableSchema
>;

export const patchTransactionConstructableSchema = object({
  id: id().optional(),
  uid: uid().optional(),
  date: date().optional(),
  comment: comment().optional().nullable(),
  category: category().optional(),
  integerAmount: integerAmount().optional(),
})
  .defined()
  .required();

export type PatchTransactionConstructableSchema = InferType<
  typeof patchTransactionConstructableSchema
>;
