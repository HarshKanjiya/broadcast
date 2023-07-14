"use client";
import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_VARIABLE } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";
import PostFeedSkeleton from "../skeleton/PostFeedSkeleton";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  broadcastName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ broadcastName, initialPosts }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

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

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts[0] !== null &&
        posts.map((post, index) => {
          const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);

          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
          );

          if (index === posts.length - 1) {
            return (
              <li key={post.id} ref={ref}>
                <Post
                  key={post.id}
                  commentAmt={post.comments.length}
                  post={post}
                  broadcastName={post.broadcast.name}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                />
              </li>
            );
          } else {
            return (
              <Post
                key={post.id}
                post={post}
                broadcastName={post.broadcast.name}
                commentAmt={post.comments.length}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            );
          }
        })}
      {isFetchingNextPage ? <PostFeedSkeleton /> : null}
    </ul>
  );
};

PostFeed.displayName = "PostFeed";
export default PostFeed;
