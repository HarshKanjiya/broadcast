import SubscibeLeaveToggler from "@/components/layouts/broadcast/SubscibeLeaveToggler";
import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";

interface layoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const layout = async ({ children, params: { slug } }: layoutProps) => {
  const session = await getAuthSession();

  const broadcast = await db.broadcast.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  if (!broadcast) return notFound();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          Broadcast: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });
  const isSubscribed = !!subscription;

  const memberCount = await db.subscription.count({
    where: {
      Broadcast: {
        name: slug,
      },
    },
  });

  return (
    <div className=" sm:container max-w-7xl mx-auto h-full pt-12 ">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* //*information bar */}

          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200  order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">
                About broadcast / {broadcast.name}
              </p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500 ">Created on</dt>
                <dd className="text-gray-500 ">
                  <time dateTime={broadcast.createdAt.toDateString()}>
                    {format(broadcast.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 ">Members</dt>
                <dd className="text-gray-500 ">
                  <div className="text-gray-500">{memberCount}</div>
                </dd>
              </div>
              {broadcast.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  You are the Owner
                </div>
              ) : null}
              {broadcast.creatorId !== session?.user.id ? (
                <SubscibeLeaveToggler
                  broadcastId={broadcast.id}
                  broadcastName={broadcast.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

layout.displayName = "layout";
export default layout;
