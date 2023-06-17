import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { FC } from "react";

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
      },
    },
  });

  return <div>page</div>;
};

page.displayName = "page";
export default page;
