import CreatePostComp from "@/components/layouts/broadcast/CreatePostComp";
import PostFeed from "@/components/layouts/posts/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_VARIABLE } from "@/config";
import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    slug: string;
  };
}

const page = async function ({ params: { slug } }: pageProps) {
  const session = await getAuthSession();

  const broadcast = await db.broadcast.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          Broadcast: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_VARIABLE,
      },
    },
  });

  if (!broadcast) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl  h-14">
        broadcast / {broadcast.name}
      </h1>

      <CreatePostComp session={session} />

      <PostFeed initialPosts={[]} broadcastName={broadcast.name} />
    </>
  );
};

page.displayName = "page";
export default page;
