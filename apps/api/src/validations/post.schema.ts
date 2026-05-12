import { z } from "zod";

export const getPostsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
  }),
});
export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters!").max(120),
    content: z.string(),
  }),
});
export const deleteParamsSchema = z.object({
  params: z.object({
    id: z.string().min(10, "Invalid ID length"),
  }),
});

export type DeletePostInput = z.infer<typeof deleteParamsSchema>["params"];
export type GetPostsInput = z.infer<typeof getPostsQuerySchema>["query"];
export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
