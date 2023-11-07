import { z } from "zod";
import { NAME_MAX } from ".";

export const idValidator = z.string().uuid();
export const optionalIdValidator = idValidator.optional();
export const nameValidator = z.string().min(1).max(NAME_MAX);
export const equationValidator = z.union([
  z.number().int(),
  z.string().min(1).max(NAME_MAX),
]);

export type Equation = z.infer<typeof equationValidator>;
