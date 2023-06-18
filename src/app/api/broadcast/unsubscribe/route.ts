import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { BroadcastSubscriptionValidator } from "@/lib/validators/broadcast";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session)
      return new Response("You have to Login to Subscribe to this Network!", {
        status: 401,
      });

    const { broadcastId } = BroadcastSubscriptionValidator.parse(
      await req.json()
    );

    const subscriptionExistance = await db.subscription.findFirst({
      where: {
        BroadcastId: broadcastId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExistance) {
      return new Response("You are not Subscribed to this Network!", {
        status: 400,
      });
    }

    const broadcast = await db.broadcast.findFirst({
      where: {
        id: broadcastId,
        creatorId: session.user.id,
      },
    });

    if (broadcast)
      return new Response("You cannot Unsubscribe to your Network!", {
        status: 422,
      });

    await db.subscription.delete({
      where: {
        userId_BroadcastId: {
          BroadcastId: broadcastId,
          userId: session.user.id,
        },
      },
    });

    return new Response("Network unsubscribed!");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not unsubscribe to this Network!", {
      status: 500,
    });
  }
}
