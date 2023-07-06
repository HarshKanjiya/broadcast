import CommentsSection from "@/components/layouts/posts/CommentsSection";
import EditorOutputContent from "@/components/layouts/posts/EditorOutputContent";
import PostVoteServer from "@/components/layouts/posts/Votes/PostVoteServer";
import CommentsSkeleton from "@/components/layouts/skeleton/CommentsSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { db } from "@/lib/db";
import { redis } from "@/lib/radis";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { Check } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface pageProps {
  params: {
    postid: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: pageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postid}`
  )) as CachedPost;

  let post:
    | (Post & {
      votes: Vote[];
      author: User;
    })
    | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postid,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense
          fallback={
            <Skeleton className="sm:ml-4 w-20 h-6 sm:h-20 sm:w-8 mb-4 sm:mb-0 " />
          }
        >
          {/* @ts-expect-error */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findFirst({
                where: {
                  id: params.postid,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>
        <div className="sm:w-0 w-full bg-white rounded-sm flex-1 p-4 sm:px-4 sm:py-3  ">
          <div className="pb-2 flex flex-col gap-2">
            <p className="text-xs text-gray-500">Posted by</p>
            <div className="flex gap-4 items-center justify-start ">
              <div className="relative">
                <Image
                  width={40}
                  height={40}
                  className="rounded-full"
                  src={post?.author.image ?? (cachedPost.authorImage as string)}
                  alt="user"
                />
                <div className="absolute bg-emerald-400 rounded-full h-4 w-4 bottom-0 -right-1 border-0 outline outline-2 outline-white flex justify-center items-center ">
                  <Check className="w-3 h-3 text-white " />
                </div>
              </div>
              <div>
                <p className="max-h-40 mt-1 truncate  text-gray-900 font-semibold ">
                  {post?.author.username ?? cachedPost?.authorUsername}
                </p>
                <p className="text-xs text-gray-500">
                  {moment(post?.createdAt ?? cachedPost?.createdAt).toNow()}
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-xl font-semibold py-2 leading-6 to-gray-900 ">
            {post?.title}
          </h1>

          <EditorOutputContent content={post?.content} />

          <Suspense fallback={<CommentsSkeleton />} >
            {/* @ts-ignore */}
            <CommentsSection postId={post?.id ?? cachedPost?.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

page.displayName = "page";
export default page;
