import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { BroadcastValidator } from "@/lib/validators/broadcast";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized!", { status: 401 });

    const { name } = BroadcastValidator.parse(await req.json());

    const broadcastExistance = await db.broadcast.findFirst({
      where: { name: name },
    });

    if (broadcastExistance) {
      return new Response("Broadcast Already Exists with this name!", {
        status: 409,
      });
    }

    const broadcast = await db.broadcast.create({
      data: {
        name: name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        BroadcastId: broadcast.id,
      },
    });

    return new Response(broadcast.name, { status: 20 });
  } catch (err) {
    if (err instanceof z.ZodError) {
         
    }
  }
}
