import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { PostVoteValidator } from "@/lib/validators/votes";

export async function PATCH(req: Request) {
  try {
    const { postId, voteType } = PostVoteValidator.parse(req.json());

    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true, votes: true },
    });

    if (!post) {
      return new Response("Post not found!", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK");
      }
      await db.vote.update({
        where: { userId_postId: { postId, userId: session.user.id } },
        data: { type: voteType },
      });
    }

    // await db.vote.create({
        // data:{
        //     type:voteType
        // }
    // })

  } catch (err) {}
}
