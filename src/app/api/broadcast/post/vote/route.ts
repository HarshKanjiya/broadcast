import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { redis } from "@/lib/radis";
import { PostVoteValidator } from "@/lib/validators/votes";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTE = 2;

export async function PATCH(req: Request) {
  try {
    const { postId, voteType } = PostVoteValidator.parse(await req.json());

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
    } else {
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTE) {
        const cachePayload: CachedPost = {
          authorUserName: post.author.username ?? "",
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          id: post.id,
          title: post.title,
          currentVote: voteType,
        };
        await redis.hset(`post:${postId}`, cachePayload);
      }
      return new Response("OK");
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId: postId,
      },
    });
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTE) {
      const cachePayload: CachedPost = {
        authorUserName: post.author.username ?? "",
        content: JSON.stringify(post.content),
        createdAt: post.createdAt,
        id: post.id,
        title: post.title,
        currentVote: voteType,
      };
      await redis.hset(`post:${postId}`, cachePayload);
    }
    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not Vote to this post, please try Again!", {
      status: 500,
    });
  }
}
