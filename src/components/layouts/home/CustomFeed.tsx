import { INFINITE_SCROLLING_PAGINATION_VARIABLE } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "../posts/PostFeed";
import { getServerSession } from "next-auth";

const CustomFeed = async ({}) => {
  const session = await getServerSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      broadcast: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      broadcast: {
        name: {
          in: followedCommunities.map(({ broadcast }) => broadcast.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      broadcast: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_VARIABLE,
  });

  return <PostFeed initialPosts={posts} />;
};

CustomFeed.displayName = "CustomFeed";
export default CustomFeed;
