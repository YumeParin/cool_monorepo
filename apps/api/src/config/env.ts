import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(35),
  FRONTEND_URL: z.url(),
  NODE_ENV: z.string().default("development"),
});

export const env = envSchema.parse(process.env);
