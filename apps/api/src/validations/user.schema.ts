import { buffer } from "node:stream/consumers";
import { z } from "zod";

export const getPostsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
  }),
});
export const deleteUserParamsSchema = z.object({
  params: z.object({
    id: z.uuid("Invalud user ID format"),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name is too short").max(64, "Name is too long"),
  }),
});
export const uploadAvatarSchema = z.object({
  file: z.object({
    mimetype: z
      .string()
      .startsWith("image/png", "Only png images are accepted"),
    size: z.number().max(5 * 1024 * 1024, "Imgae is too big"),
    buffer: z.any(),
  }),
});

export const beta_uploadAvatarUrlSchema = z.object({
  body: z.object({
    avatarUrl: z
      .url("Your request is not an URL")
      .startsWith("https://", "The URL should at least be in https")
      .regex(/\.(png|jpg|jpeg)$/i, "The image must be a .png, .jpg or .jpeg")
      .min(12, "The URL isn't valid"),
  }),
});

// export type DeletePostInput = z.infer<typeof deleteParamsSchema>["params"];
export type DeleteUserInput = z.infer<typeof deleteUserParamsSchema>["params"];
export type UpdateMeInput = z.infer<typeof updateMeSchema>["body"];
export type UploadAvatarInput = z.infer<typeof uploadAvatarSchema>["file"];
export type beta_UploadAvatarUrlInput = z.infer<
  typeof beta_uploadAvatarUrlSchema
>["body"];
