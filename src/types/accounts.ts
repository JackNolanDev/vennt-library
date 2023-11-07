import { z } from "zod";
import { PASSWORD_MIN, PASSWORD_MAX, nameValidator, idValidator } from ".";

export const emailValidator = z.string().email();
export const passwordValidator = z.string().min(PASSWORD_MIN).max(PASSWORD_MAX);
export const roleValidator = z.enum(["USER", "ADMIN"]);

export const signupRequestValidator = z.object({
  username: nameValidator,
  email: emailValidator,
  password: passwordValidator,
});

export const loginRequestValidator = z.object({
  username: nameValidator,
  password: passwordValidator,
});

export const accountInfoValidator = z.object({
  id: idValidator,
  username: nameValidator,
  email: emailValidator,
  role: roleValidator,
});

export const dangerousAccountInfoValidator = accountInfoValidator.extend({
  password: passwordValidator,
});

export const accountTokenValidator = z.object({
  token: z.string(),
});

export type SignupRequest = z.infer<typeof signupRequestValidator>;
export type LoginRequest = z.infer<typeof loginRequestValidator>;
export type AccountInfo = z.infer<typeof accountInfoValidator>;
export type AccountToken = z.infer<typeof accountTokenValidator>;
export type DangerousAccountInfo = z.infer<
  typeof dangerousAccountInfoValidator
>;
