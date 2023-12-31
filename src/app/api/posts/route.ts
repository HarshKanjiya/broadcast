import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        broadcast: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map((sub) => sub.broadcast.id);
  }

  try {
    const { limit, page, broadcastName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        broadcastName: z.string().nullish().optional(),
      })
      .parse({
        broadcastName: url.searchParams.get("broadcastName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (broadcastName) {
      whereClause = {
        broadcast: {
          name: broadcastName,
        },
      };
    } else if (session) {
      whereClause = {
        broadcast: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        broadcast: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error: any) {
    console.log("Error while Fetching posts: ", error.message);
    return new Response("Could not fetch posts", { status: 500 });
  }
}
