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

  const posts = await db.post.findFirst({
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
  //@ts-expect-error
  return <PostFeed initialPosts={posts} />;
};

CustomFeed.displayName = "CustomFeed";
export default CustomFeed;
