import Editor from "@/components/layouts/posts/Editor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    slug: string;
  };
}
const page = async ({ params: { slug } }: pageProps) => {
  const broadcast = await db.broadcast.findFirst({
    where: {
      name: slug,
    },
  });

  if (!broadcast) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in broadcast / {slug}
          </p>
        </div>
      </div>

      {/* //*form */}

      <Editor broadcastId={broadcast.id} broadcastName={broadcast.name} />

    </div>
  );
};

page.displayName = "page";
export default page;
