import { ExtendedPost } from "@/types/db";
import { FC, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_VARIABLE } from "@/config";
import axios from "axios";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  broadcastName: string;
}

const PostFeed: FC<PostFeedProps> = ({ broadcastName, initialPosts }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const {} = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_VARIABLE}&page=${pageParam}` +
        (!!broadcastName ? `&broadcastName=${broadcastName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      <div className=""></div>
    </ul>
  );
};

PostFeed.displayName = "PostFeed";
export default PostFeed;
