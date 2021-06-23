import { z } from "zod";

export const feedbackSchema = z
  .object({
    message: z.string().optional(),
  })
  .strict();

export const postFeedbackSchema = feedbackSchema;

// Type extractions
export type FeedbackSchema = z.TypeOf<typeof feedbackSchema>;
export type PostFeedbackSchema = z.TypeOf<typeof postFeedbackSchema>;
