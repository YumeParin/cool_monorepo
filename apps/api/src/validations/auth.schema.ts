import { z } from "zod";

export const signupBodySchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password too short")
      .max(64, "Password too long")
      .trim(),
    name: z.string().min(3, "Name is too small").max(30, "Name is too long"),
  }),
});
export const loginBodySchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password too short")
      .max(64, "Password too long")
      .trim(),
  }),
});
export const refreshCookiesSchema = z.object({
  cookies: z.object({
    refreshToken: z.uuid("Invalid refresh token or missing refresh token"),
  }),
});

export type SignupAuthInput = z.infer<typeof signupBodySchema>["body"];
export type LoginAuthInput = z.infer<typeof loginBodySchema>["body"];
export type RefreshAuthInput = z.infer<typeof refreshCookiesSchema>["cookies"];
