import * as z from "zod";

export const feedbackSchema = z.object({
  message: z.string().optional(),
});

export const postFeedbackSchema = feedbackSchema;

export type FeedbackSchema = z.TypeOf<typeof feedbackSchema>;
export type PostFeedbackSchema = z.TypeOf<typeof postFeedbackSchema>;
