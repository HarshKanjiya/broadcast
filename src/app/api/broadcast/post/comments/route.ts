import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/Comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response("You have to Login to Subscribe to this Network!", {
        status: 401,
      });

    const { postId, text, replyToId } = CommentValidator.parse(
      await req.json()
    );

    await db.comment.create({
      data: {
        text: text,
        postId: postId,
        authorId: session.user.id,
        replyToId,
      },
    });
    return new Response("OK", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not Post to this Network, please try again!", {
      status: 500,
    });
  }
}
