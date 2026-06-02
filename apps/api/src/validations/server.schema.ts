import { z } from "zod";

// A reusable schema for Discord Snowflakes to keep things clean and stress-free
const discordIdSchema = z
  .string()
  .min(15, "Discord ID is too short")
  .max(25, "Discord ID is too long")
  .regex(/^\d+$/, "Discord ID must be numeric");

export const createServerSchema = z.object({
  body: z.object({
    // Only requiring what Prisma needs to initialize a Server
    discordId: discordIdSchema,
  }),
});

export const editServerSchema = z.object({
  body: z.object({
    // Made these optional so you can update just one channel at a time (e.g., a PATCH request).
    // They accept nullable because your Prisma schema allows them to be null (String?).
    welcomeChannelId: discordIdSchema.optional().nullable(),
    barrierChannelId: discordIdSchema.optional().nullable(),
    loggingChannelId: discordIdSchema.optional().nullable(),
  }),
});

export const deleteParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Server ID is required"), // Assuming this maps to your Prisma `id`
  }),
});

// Type Exports
export type CreateServerInput = z.infer<typeof createServerSchema>["body"];
export type EditServerInput = z.infer<typeof editServerSchema>["body"];
export type DeleteServerInput = z.infer<typeof deleteParamsSchema>["params"];