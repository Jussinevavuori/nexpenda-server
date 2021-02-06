import { object, string, InferType } from "yup";

const Status = () => string().oneOf(["online", "offline"]);

export const configSchema = object({
  status: Status().required(),
}).required();

export const patchConfigSchema = object({
  status: Status(),
}).required();

export type ConfigSchema = InferType<typeof configSchema>;
export type PatchConfigSchema = InferType<typeof patchConfigSchema>;
