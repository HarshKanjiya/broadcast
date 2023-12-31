import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response("You have to Login to Subscribe to this Network!", {
        status: 401,
      });

    const { broadcastId, title, content } = PostValidator.parse(
      await req.json()
    );

    const subscriptionExistance = await db.subscription.findFirst({
      where: {
        broadcastId: broadcastId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExistance) {
      return new Response(
        "You need to Join Broadcast Network to create post!",
        {
          status: 400,
        }
      );
    }

    const post = await db.post.create({
      data: {
        broadcastId: broadcastId,
        authorId: session.user.id,
        title,
        content,
      },
    });

    const followers = await db.subscription.findMany({
      where: {
        broadcastId: broadcastId,
      },
    });

    let newData = followers.map((data) => {
      if (data.userId !== session.user.id) {
        return { userId: data.userId, postId: post.id, type: "UNSEEN" };
      }
    });

    await db.notification.createMany({
      skipDuplicates: true,
      // @ts-ignore
      data: [...newData],
    });

    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not Post to this Network, please try again!", {
      status: 500,
    });
  }
}
