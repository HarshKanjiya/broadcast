import CustomFeed from "@/components/layouts/home/CustomFeed";
import GenralFeed from "@/components/layouts/home/GenralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/AuthOptions";
import { HomeIcon, Plus } from "lucide-react";
import Link from "next/link";

const page = async ({ }) => {
  const session = await getAuthSession();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl  ">Your Feed</h1>
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6 ">
        {/*//* feed  */}

        {/* @ts-ignore */}
        {session ? <CustomFeed /> : <GenralFeed />}

        {/*//* broadcast  */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200  order-first md:order-last ">
          <div className="bg-emerald-200 px-5 py-2  pb-4 ">
            <p className=" font-semibold py-3 flex items-center gap-1.5 ">
              <HomeIcon className="w-5 h-5 " />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-5 bg-white py-3 text-sm leading-6 ">
            <div className=" flex justify-between gap-x-3 py-3 ">
              <p className=" text-zinc-400 ">
                Your personal Broadcast Homepage. You can Find out Updates from
                Your Favourite Broadcasts.
              </p>
            </div>
            <Link
              href="/broadcast/create"
              className={buttonVariants({ className: "w-full mt-2 mb-6 " })}
            >
              <Plus className="w-5 h-5 mr-2 " /> Create new Broadcast
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

page.displayName = "page";
export default page;
