import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be atleast 3 characters" })
    .max(128, { message: "Title cannot exceed 128 characters" }),
  broadcastId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
