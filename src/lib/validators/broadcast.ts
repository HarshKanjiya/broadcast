import { z } from "zod";

export const BroadcastValidator = z.object({
  name: z.string().min(3).max(28),
});

export const BroadcastSubscriptionValidator = z.object({
  broadcastId: z.string(),
});

export type CreateBroadcastPayload = z.infer<typeof BroadcastValidator>;
export type SubsciptionPayload = z.infer<typeof BroadcastSubscriptionValidator>;
