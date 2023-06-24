import { INFINITE_SCROLLING_PAGINATION_VARIABLE } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "../posts/PostFeed";

const GenralFeed = async ({}) => {
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

GenralFeed.displayName = "GenralFeed";
export default GenralFeed;
